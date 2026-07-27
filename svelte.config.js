import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * GitHub Pages serves this repo as a *project* site, from
 * `mikedpad.github.io/quick-notes/` rather than from a domain root. Every
 * absolute URL SvelteKit emits — the `_app` bundle, the fonts, the wall
 * textures — has to carry that prefix or it resolves to the user site and 404s.
 *
 * `vite dev` serves from its own root, so the prefix is dropped there. `vite
 * preview` deliberately keeps it: preview exists to serve the real build, and a
 * preview that serves it from a different path than the build was made for
 * proves nothing. Anything else (a build for somewhere other than Pages) can set
 * BASE_PATH, including to an empty string.
 */
const base = process.env.BASE_PATH ?? (process.argv.includes('dev') ? '' : '/quick-notes');

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // GitHub Pages serves 404.html for anything it cannot find, which is what
      // makes it the SPA fallback here.
      fallback: '404.html',
    }),
    paths: { base },
    // No custom aliases: everything lives under $lib, which SvelteKit provides.
  },
};

export default config;
