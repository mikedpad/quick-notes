# Quick Notes

Offline-first markdown notes that live in your browser. No account, no server — notes are
stored in IndexedDB and the whole thing deploys as a static site.

Built with SvelteKit 2 (Svelte 5 runes), Tailwind 4 and [Skeleton 5](https://skeleton.dev).

## Getting started

```sh
pnpm install
pnpm dev
```

| Script              | Does                                          |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Vite dev server                               |
| `pnpm build`        | Static build into `./build`                   |
| `pnpm preview`      | Serve the production build                    |
| `pnpm test`         | Vitest suite (`:watch`, `:coverage` variants) |
| `pnpm check`        | svelte-check type and a11y diagnostics        |
| `pnpm lint`         | Prettier check + ESLint                       |
| `pnpm format`       | Rewrite with Prettier                         |
| `pnpm generateData` | Regenerate the first-run sample notes         |

## Notes are markdown

Headings, emphasis, lists, code, blockquotes, rules and links. Text only — images and embeds
are stripped, along with any HTML that could execute. The editor has a Write/Preview toggle.

## Theming

The art direction is a single attribute in `src/app.html`:

```html
<html lang="en" data-theme="cerberus"></html>
```

Any of Skeleton's themes works; register additional ones in `src/styles/app.css`. Light and
dark both follow the OS setting with no toggle needed.

## Architecture

See [NOTES.md](NOTES.md) for the layer breakdown, the storage contract, the sync-ready record
shape, and where to plug in a new design.
