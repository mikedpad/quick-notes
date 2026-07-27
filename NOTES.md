# Quick Notes — Architecture Notes

Written during the 2026-07-26 restore-and-rearchitect, updated when the UI moved to Skeleton
and notes became markdown. Describes how the app is built now, why it's shaped this way, and
where to plug in a new art direction.

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
  ui/                    presentational, zero domain knowledge
    ConfirmDialog.svelte
  notes/                 domain-aware
    NoteCard, NoteGrid, NoteEditor
    markdown.ts          markdown → sanitised HTML
src/styles/
  app.css                Tailwind + Skeleton imports, theme, and markdown prose styling
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
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601 — doubles as the LWW clock
  deletedAt: string | null; // tombstone
  syncedAt: string | null; // null = local-only / pending push
};
```

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
don't author get styled. It sets spacing and rhythm; every colour still resolves through the
Skeleton theme.

---

## 5. Reskinning: where a new art direction plugs in

### The theme is the seam

The UI is Tailwind 4 + [Skeleton 5](https://skeleton.dev). Components use Skeleton's semantic
colour roles (`primary`, `secondary`, `surface`, `success`, `warning`, `error`) and its
utilities (`card`, `btn`, `btn-icon`, `input`, `textarea`, `dialog`, `preset-filled-*`,
`preset-tonal-*`) — never a literal colour.

Switching the whole art direction is one attribute:

```html
<html lang="en" data-theme="cerberus"></html>
```

Skeleton ships 24 themes (`cerberus`, `mona`, `vox`, `catppuccin`, `rose`, `terminus`,
`vintage`, `wintry`, …). Register more by adding imports in `app.css`:

```css
@import '@skeletonlabs/skeleton/themes/mona';
```

A bespoke theme is a CSS block defining the same custom properties — see any file in
`node_modules/@skeletonlabs/skeleton/src/themes/` for the full surface.

Light and dark both work without a toggle: Skeleton uses `light-dark()` and pairing utilities
(`bg-surface-100-900` = shade 100 in light, 900 in dark), so the theme follows the OS setting.

### What to expect when swapping in a new design

If a component needs editing to accommodate a colour or spacing change, that's a gap in the
theme's coverage, not something to work around — say so and it gets widened. A genuinely
different _layout_ (a masonry board, a sidebar editor) means editing `notes/NoteGrid.svelte`
and `notes/NoteEditor.svelte`, which is the intended place for it. `domain/`, `data/` and
`state/` should not need to change for any visual work at all.

---

## 6. Tests

`pnpm test` — 121 tests across 6 files, Vitest in Node. `pnpm test:watch`,
`pnpm test:coverage`.

| File                              | Covers                                                       |
| --------------------------------- | ------------------------------------------------------------ |
| `domain/note.test.ts`             | create/edit/tombstone, timestamps, immutability, validation  |
| `data/repo.contract.ts`           | the shared spec — not a test file itself                     |
| `data/adapters/memory.test.ts`    | contract + construction/isolation                            |
| `data/adapters/indexeddb.test.ts` | contract + schema, connection reuse, durability, rejection   |
| `data/seed.test.ts`               | generator-to-domain mapping                                  |
| `state/notes.svelte.test.ts`      | init/seed, sorting, add/update/remove, error paths           |
| `notes/markdown.test.ts`          | rendering + sanitising (XSS, images, iframes, `javascript:`) |

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
`pnpm preview`: **25/25 on a clean database** — seeding, markdown rendering of every construct,
live preview, XSS neither rendering nor executing, storage holding markdown _source_,
persistence across reloads, edit pre-fill, the nested discard guard, and delete writing a
tombstone rather than dropping the row.

That script is **not committed** — it lives in the scratch directory. Worth landing as a
Playwright suite if browser coverage should be permanent.

---

## 7. Notable behaviour changes from the original

- **Notes persist.** The form used to POST to `/` on a static host, which discarded the input.
- **Edit and delete exist.** Hover or focus a card to reveal its actions.
- **Notes are markdown**, with a Write/Preview toggle in the editor.
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

## 8. Known gaps / next candidates

- **No committed browser tests.** See §6.
- **No deploy workflow.** `homepage` points at gh-pages but nothing publishes there.
- **Tombstones accumulate.** Nothing calls `purge`. Harmless at this scale; needs a compaction
  pass if it ever grows.
- **No search or filter.** A title/body search would be a linear scan over the cached array,
  fine for hundreds of notes.
- **Card actions are hover/focus-revealed**, which is weak on touch.
- **Cards are a fixed height with internal scroll.** Long notes are readable but clipped; a
  masonry layout or a read view would suit markdown better.
- **No theme switcher.** Changing `data-theme` is a source edit; exposing it in the UI is a
  small job once the art direction settles.

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
