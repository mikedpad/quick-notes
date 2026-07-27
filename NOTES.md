# Quick Notes — Architecture Notes

Written during the 2026-07-26 restore-and-rearchitect, updated when the UI moved to Skeleton
and notes became markdown, and again on 2026-07-27 when the Post-It wall redesign landed.
Describes how the app is built now, why it's shaped this way, and where to plug in a new art
direction.

**Fixed constraints:**

- Offline. No backend server. Static hosting (GitHub Pages) is the deploy target.
- Persistence is **native IndexedDB** — no wrapper library.
- Cloud sync is a _maybe, later_. The data model is shaped so adding it needs no migration.

---

## 1. Layers

Dependencies point in one direction only: `routes → notes/ → ui/ → state → data → domain`.
Nothing lower ever imports from something higher.

```text
src/lib/
  domain/
    note.ts              Note model, factory, validation, pure helpers. No I/O, no Svelte.
    note.test.ts
  data/
    repo.ts              interface NotesRepo — the storage contract
    repo.contract.ts     the contract spec, run against every adapter
    index.ts             createRepo() — picks the adapter for the environment
    seed.ts / seed.json  faker-generated first-run sample notes
    adapters/
      indexeddb.ts       native IndexedDB
      memory.ts          prerender + tests
  state/
    notes.svelte.ts      runes-based reactive cache in front of the repo
    wall.svelte.ts       wall preferences, persisted to localStorage
  ui/                    presentational, zero domain knowledge
    ConfirmDialog.svelte
    WallOptions.svelte   the wall settings menu
    paper.ts             the five papers and the scatter that pins them up
  notes/                 domain-aware
    NoteCard, NoteGrid, NoteEditor
    markdown.ts          markdown → sanitised HTML
  assets/textures/       cork.png, charcoal.png — imported, so Vite hashes and bases them
src/dev/
  generateData.ts        pnpm generateData — the first-run sample notes
  generateTexture.ts     pnpm generateTexture — the seamless charcoal tile
src/styles/
  app.css                design tokens, the three wall surfaces, markdown prose styling
```

### Why the `ui/` vs `notes/` split matters

`ui/` knows nothing about notes. `notes/` composes UI and is the only place the `Note` type
appears in markup.

Originally `AddNote.svelte` was simultaneously a trigger button, a modal host and a form,
which is exactly why it could not be reused to edit an existing note. `NoteEditor` now serves
both create and edit, differing only in the props it's given.

---

## 2. Data layer

### The repository boundary

`NotesRepo` (`data/repo.ts`) is the single seam between the app and storage:

```ts
interface NotesRepo {
  list(): Promise<Note[]>;
  get(id: string): Promise<Note | undefined>;
  put(note: Note): Promise<void>;
  putMany(notes: Note[]): Promise<void>;
  purge(id: string): Promise<void>;
  clear(): Promise<void>;
}
```

`put` is an upsert rather than separate create/update calls — the same operation a sync merge
performs, so one method covers both. `createRepo()` in `data/index.ts` is the only place that
decides which adapter is used; adding a backend later means adding an adapter file and one
line there, not touching state or components.

### IndexedDB adapter

Written against the raw API. The event-based plumbing (`fromRequest`, `fromTransaction`,
`connect`) is wrapped once at the top of `adapters/indexeddb.ts` so the repository methods
below read as ordinary async code.

Two details worth keeping in mind when editing it:

- Writes await **transaction completion**, not the individual request. A request can succeed
  and still be rolled back; only `oncomplete` means the data landed.
- `onupgradeneeded` runs inside its own versionchange transaction and cannot await anything.
  Schema changes go in as further `if (oldVersion < n)` blocks — that's what keeps
  `DB_VERSION` meaningful.

### Record shape

```ts
type Note = {
  id: string; // crypto.randomUUID(), client-generated
  title: string;
  body: string; // markdown source
  color?: number; // 0–4, which paper it is written on
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601 — doubles as the LWW clock
  deletedAt: string | null; // tombstone
  syncedAt: string | null; // null = local-only / pending push
};
```

`color` is optional rather than required, and that is deliberate: notes written before the
redesign have no colour, and inventing one at read time would be a migration pretending to be
a default. `paperIndex(note, position)` resolves it — the note's own colour if it has one, its
place on the wall modulo five if it doesn't. New notes always carry one (the editor's swatches
write it), and `loadSeed()` deals them round-robin so a seeded wall keeps its colours when
notes are added above it. No `DB_VERSION` bump: the field adds no index, and IndexedDB does
not mind a record shape that grew.

Each field is load-bearing for the "sync later without a migration" goal:

- **Client-generated ids** — offline creation needs no round-trip and no id reconciliation.
- **ISO strings, not `Date`** — identical in JSON, IndexedDB and HTTP. No revival step.
- **`deletedAt` tombstone** — a hard delete is indistinguishable from "never seen", so deleted
  notes would resurrect on the first pull. Deletion writes a tombstone via `put`; `purge`
  exists for genuinely dropping rows later.
- **`syncedAt`** — acts as the outbox (`WHERE syncedAt IS NULL`) without a second store.

The `by-updatedAt` index is already in place for `updatedAt > lastPulledAt` pulls.

### Seeding

On first run `notes.init()` finds an empty store and writes `seed.json` into it. After that
the seed is never read again. Note the check is on **raw record count**, not live notes — so
deleting every note leaves tombstones behind and does not re-seed on the next load.

---

## 3. State layer

`state/notes.svelte.ts` is a runes-based class holding the reactive cache:

```ts
notes.notes; // live notes, newest first (tombstones filtered out)
notes.count;
notes.status; // 'idle' | 'loading' | 'ready' | 'error'
notes.init(); // idempotent — safe to call from every mount
notes.add(draft);
notes.update(id, draft);
notes.remove(id); // writes a tombstone
```

Components read `notes` and call the mutators; they never touch storage. Writes apply to local
state first and persist after, so the UI stays responsive. A failed write surfaces on
`notes.error` but **leaves the optimistic change on screen** — dropping it would discard what
the user just typed.

`createNotesStore(repo)` is exported alongside the singleton so tests can inject
`createMemoryRepo()` instead of IndexedDB.

**Prerender note:** IndexedDB doesn't exist on the server, so `createRepo()` returns the memory
adapter during the prerender pass and the shell renders empty. `$effect` never runs
server-side, which is why `notes.init()` is kicked off from one in `+page.svelte`.

### The wall store

`state/wall.svelte.ts` holds how the wall is hung — `{ surface, scatter, zoom, taped }` — in
localStorage rather than in the repository. These are preferences: losing them costs the user
nothing, and they have no business syncing between devices that may not even have the same
screen. `createWallStore(storage)` takes the storage so tests can hand it a stub; the singleton
gets `localStorage` in the browser and nothing at all during prerender.

Two things there are load-bearing:

- **Everything read back is validated.** `parseSettings` treats the stored string as untrusted
  input — bad JSON, a surface this version has never heard of, a scatter of `"lots"` — and
  falls back field by field rather than all-or-nothing.
- **Storage failures are swallowed.** Safari's private mode throws on `setItem` rather than
  returning. A wall that forgets is fine; a wall that throws is not.

The surface is applied to `<html data-wall>`, and `app.html` carries a pre-paint script that
reads the same key. Without it, every load of a charcoal wall starts with a plaster flash,
because the page is prerendered with the default. That script and `WALL_STORAGE_KEY` are the
one piece of duplication in the app — both are commented as such.

---

## 4. Markdown

Note bodies are markdown source. HTML only ever exists at render time — nothing parsed is
persisted, so the stored data stays portable and the renderer can be swapped freely.

`notes/markdown.ts` exports:

- `renderMarkdown(source)` — marked → DOMPurify → HTML safe for `{@html}`
- `toPlainText(source)` — markdown stripped to readable text

It lives in `notes/` rather than `domain/` on purpose: sanitising needs a DOM, so it is not
pure the way the rest of the model is.

**Text formatting only.** The allow-list permits headings, emphasis, lists, code, blockquotes,
rules and links; `img`, `iframe`, `svg`, `style` and every event handler are stripped. So
there is nothing in a note that can load a remote resource or break the card layout. Links get
`target="_blank" rel="noopener noreferrer"` via a DOMPurify hook.

`breaks: true` is set, so a single newline is a line break — in a notes app people press Enter
once and expect a new line, not a continuation of the paragraph.

Prose styling lives in one `.note-prose` block in `app.css`, which is the only place tags we
don't author get styled. It sets spacing and rhythm in `em`, so a sticky note sets the scale
and everything the parser emitted follows.

---

## 5. The Post-It wall

The art direction is paper: coloured squares scattered on a textured wall, handwritten, taped
up, lifted on hover. It replaced the Skeleton card grid on 2026-07-27.

### Where the design lives

Skeleton and its `cerberus` theme are still imported — the resets and form/dialog base are
worth keeping — but nothing renders through its palette any more. The design is in three
places, and that is the whole map:

- **`styles/app.css`** — the tokens. `--font-hand` (Caveat) and `--font-note` (Kalam),
  `--color-ink`, `--color-crimson`, the three shadows, and the three wall surfaces keyed off
  `:root[data-wall]`. These are unlayered on purpose, so they win against Skeleton's
  `@layer base` without a specificity fight.
- **`ui/paper.ts`** — the five papers (each a light/base/shade triple, handed to CSS as
  `--paper-*` custom properties so the gradient itself stays in the stylesheet) and
  `scatterAt`, which turns a position into an angle and a drop. Deterministic, so the wall
  looks hand-stuck and looks the same after a reload.
- **Component `<style>` blocks** — everything else. A sticky note's gradient, tape, mask and
  hover lift belong next to its markup, not in a global sheet.

Fonts are self-hosted via fontsource. The app is offline-first; a wall that only has its
handwriting when a CDN is reachable is not.

### The charcoal wall is generated, not photographed

It started as an 838 kB photographic texture stretched over the viewport. `pnpm
generateTexture` (`src/dev/generateTexture.ts`) writes a 14 kB seamless 256 px tile instead —
value noise on a wrapping lattice, so it tiles by construction rather than by mirroring, and
centred on mid-grey.

`app.css` lays that one tile down twice, at 317 px and 613 px, and composites both in
`soft-light` over a gradient. Two coprime scales is what stops a repeating texture from reading
as one: their patterns only line up again every few thousand pixels. Blending rather than
covering means the wall's colour still lives in the stylesheet, so it can be recoloured without
touching the image.

### The editor's gestures

Three ways in and four ways out, all routed through the same dirty-check guard:

- **In:** the pencil button, or a double-click anywhere on the note. Single clicks stay inert
  so the wall can be read without setting anything off.
- **Out:** the X, Escape, Cancel, or a click off the note. The outside click only counts when
  the press _and_ the release both landed outside — otherwise a text selection dragged out of
  the textarea, or a resize that overshoots, would dismiss the note mid-gesture.
- **Resize:** drag either edge. The sheet is centred by `margin: auto`, so it grows away from
  its middle in both directions at once, and an edge only keeps up with the cursor if the
  height changes by _twice_ the distance dragged. The handles are buttons, so arrow keys do
  the same job — which the textarea's old resize corner never offered.

### Gotchas worth knowing before editing it

- **Tailwind's preflight zeroes `margin`**, including the `margin: auto` a modal `<dialog>` is
  centred by. Both dialogs set it back explicitly. Remove that line and they jump to the
  top-left corner.
- **A rotated element is its own stacking context**, so `z-index: -1` on a pseudo-element
  cannot get underneath its parent's background. The new-note pad paints its top sheet as a
  child layer for exactly this reason.
- **`{@html}` output cannot be scoped** by Svelte, which is why `.note-prose` is global.

### What to expect when swapping in a new design

A different palette or type scale is `app.css` plus `ui/paper.ts`. A different _layout_ (a
masonry board, a sidebar editor) means editing `notes/NoteGrid.svelte` and
`notes/NoteEditor.svelte`, which is the intended place for it. `domain/`, `data/` and `state/`
should not need to change for visual work — the one exception being anything that adds a field
to the record, as `color` did.

---

## 6. Tests

`pnpm test` — 163 tests across 8 files, Vitest in Node. `pnpm test:watch`,
`pnpm test:coverage`.

| File                              | Covers                                                       |
| --------------------------------- | ------------------------------------------------------------ |
| `domain/note.test.ts`             | create/edit/tombstone, timestamps, immutability, validation  |
| `data/repo.contract.ts`           | the shared spec — not a test file itself                     |
| `data/adapters/memory.test.ts`    | contract + construction/isolation                            |
| `data/adapters/indexeddb.test.ts` | contract + schema, connection reuse, durability, rejection   |
| `data/seed.test.ts`               | generator-to-domain mapping, paper round-robin               |
| `state/notes.svelte.test.ts`      | init/seed, sorting, add/update/remove, error paths           |
| `state/wall.svelte.test.ts`       | preference parsing, clamping, persistence, hostile storage   |
| `notes/markdown.test.ts`          | rendering + sanitising (XSS, images, iframes, `javascript:`) |
| `ui/paper.test.ts`                | palette wrapping, deterministic scatter                      |

Presentation is still covered by eye rather than by assertions — `paper.ts` is in the suite
because it is arithmetic the whole wall is built on, not because it is CSS.

### The contract spec is the important part

`repo.contract.ts` defines what every `NotesRepo` must do, and both adapters run it. This
exists because the memory adapter stands in for IndexedDB during prerender and throughout the
rest of the suite — if the two diverge, everything else passes against a fiction. A future
adapter (a sync-backed one) is proven correct by adding one line.

Writing it immediately caught a real divergence: IndexedDB structured-clones across the
storage boundary, so callers can't mutate stored records, while the memory adapter was handing
out live references. `memory.ts` now clones deliberately.

The suite uses `fake-indexeddb`, a real implementation of the spec — the IndexedDB tests
exercise actual transaction and upgrade handling rather than mocks.

### Browser verification

Runtime behaviour is checked separately by driving headless Chrome over CDP against
`pnpm preview`: seeding, markdown rendering of every construct, XSS neither rendering nor
executing, storage holding markdown _source_, persistence across reloads, edit pre-fill, the
nested discard guard, and delete writing a tombstone rather than dropping the row.

Re-run for the redesign, covering what the wall added: the three surfaces, preferences
surviving a reload (and applying before first paint), scatter and tape reaching the notes, both
dialogs centred, a new note keeping the paper it was written on, and 414 px wide without
horizontal overflow.

Re-run again for the editor's gestures, which are the part least likely to survive a refactor
unnoticed: single click inert, double click opening, an edge drag moving the sheet by twice the
cursor's travel, an outside click dismissing a clean note but stopping a dirty one at the
guard, and a selection dragged off the note leaving it open.

Those scripts are **not committed** — they live in the scratch directory. Worth landing as a
Playwright suite if browser coverage should be permanent.

---

## 7. Notable behaviour changes from the original

- **Notes persist.** The form used to POST to `/` on a static host, which discarded the input.
- **Edit and delete exist.** Hover or focus a card to reveal its actions.
- **Notes are markdown.** The editor writes source; the wall renders it.
- **`Modal` is no longer a global singleton.** It was driven by a module-level `modalOpen`
  store, so every `<Modal>` shared one boolean. Dialogs are now native `<dialog>` +
  `showModal()`, which brings a real focus trap, inert background, Esc handling and
  `::backdrop` that the hand-rolled overlay did without.
- **`window.confirm` is gone.** Delete and discard-unsaved-changes both use a themed
  `ConfirmDialog`. Browsers stack modal dialogs, so the editor's discard guard opens on top of
  the editor itself.
- **Validation messages are visible.** The `.error` span used to be rendered, styled and
  fade-transitioned but never populated; messages surfaced as native browser bubbles.
- **`name` and `label` are separate props.** `name={label}` meant renaming display copy
  silently renamed the form data key.

---

## 8. Deployment

The site is a GitHub Pages **project** site — `mikedpad.github.io/quick-notes/`, served from
the `gh-pages` branch — which is the only interesting thing about deploying it. Three details
follow from that subpath, and getting any of them wrong produces a blank page rather than an
error:

- **`paths.base`** in `svelte.config.js`. Every absolute URL SvelteKit emits needs the
  `/quick-notes` prefix or it resolves against the user site and 404s. `vite dev` drops it;
  `vite preview` keeps it, so preview serves the build the way Pages will.
- **`static/.nojekyll`**. Pages runs output through Jekyll by default, and Jekyll discards
  directories whose names start with an underscore — which is `_app`, the entire application.
- **`fallback: '404.html'`**. Pages serves `404.html` for anything it cannot find, so that is
  what the SPA fallback has to be called.

Asset URLs inside the compiled CSS (fonts, wall textures) come out relative to the stylesheet,
so they are unaffected by the base path either way.

### The service worker tombstone

`static/service-worker.js` exists only to undo the one the 2020 Create React App build left
registered in visitors' browsers. Deleting a worker from the server does not unregister it, and
a failed update fetch leaves the existing one in place — so without this, anyone who saw the
React version would go on being served it from cache regardless of what is deployed. The
replacement keeps the old file's name, unregisters itself, empties every cache and reloads the
page. It can be deleted once returning visitors have plausibly all been through.

Publishing is manual — build, then replace the `gh-pages` branch with `build/`:

```bash
pnpm build
git worktree add ../qn-pages --detach origin/gh-pages
# replace everything in ../qn-pages with the contents of build/, then:
git -C ../qn-pages add -A && git -C ../qn-pages commit -m "Deploy"
git -C ../qn-pages push origin HEAD:gh-pages
git worktree remove ../qn-pages
```

A GitHub Actions workflow doing the same on every push to `master` is the obvious next step;
it would work against the current Pages setting without changing it.

---

## 9. Known gaps / next candidates

- **No committed browser tests.** See §6.
- **No deploy workflow.** Publishing is the manual sequence in §8.
- **No favicon.** Browsers ask for `/favicon.ico` at the domain root and get a 404 — harmless,
  and the one request the app makes that it cannot satisfy.
- **Tombstones accumulate.** Nothing calls `purge`. Harmless at this scale; needs a compaction
  pass if it ever grows.
- **No search or filter.** A title/body search would be a linear scan over the cached array,
  fine for hundreds of notes.
- **Note actions are hover/focus-revealed**, which is weak on touch — a tap reveals them, but
  only because the first tap counts as a hover. Worth an explicit tap-to-open read view.
- **No Write/Preview toggle.** The redesign's editor is a single sheet of ruled paper, so
  markdown is authored without a live preview. The card is the preview.
- **Notes are square and clip.** Long ones fade out under a mask rather than scrolling; there
  is no read view to open them into yet, which is the other half of the point above.
- **`WALL_STORAGE_KEY` is duplicated** in the `app.html` pre-paint script. Unavoidable without
  giving up the flash-free first paint; both sides are commented.
- **`cork.png` is 169 kB** and still the largest asset, ten times the size of the charcoal
  tile it sits beside. It is a 512 px tile that could get the same treatment.
- **Double-click to open is pointer-only.** The pencil button covers keyboard and screen
  readers, but there is no touch equivalent of a double-click on a note.

---

## Appendix: the restore

The project was pinned to SvelteKit `1.0.0-next.302` (early 2022); `pnpm install` resolved that
range up to 1.30.4, leaving framework and source two convention-generations apart. `pnpm dev`
failed at `svelte-kit dev` → _"Invalid command: dev"_.

| Area         | Before                                    | After                                   |
| ------------ | ----------------------------------------- | --------------------------------------- |
| Dev command  | `svelte-kit dev`                          | `vite dev`                              |
| Routes       | `__layout.svelte`, `index.svelte`         | `+layout.svelte`, `+page.svelte`        |
| Template     | `%svelte.head%` / `%svelte.body%`         | `%sveltekit.head%` / `%sveltekit.body%` |
| Vite config  | nested under `kit.vite` (removed)         | `vite.config.ts`                        |
| Preprocessor | `svelte-preprocess`                       | `vitePreprocess()`                      |
| Lint         | `eslint-plugin-svelte3` + `.eslintrc.cjs` | `eslint-plugin-svelte` + flat config    |
| Components   | Svelte 4 syntax                           | Svelte 5 runes                          |
| Styling      | hand-written CSS + custom tokens          | Tailwind 4 + Skeleton 5                 |

Stack: Svelte 5.56 / SvelteKit 2.70 / Vite 8 / TypeScript 5.9 / Tailwind 4 / Skeleton 5.
Runtime dependencies: `marked` and `dompurify`. `nanoid` was dropped for `crypto.randomUUID()`,
`lodash.debounce` and `gh-pages` were unused, and the `@fontsource` packages went when Skeleton
took over typography.
