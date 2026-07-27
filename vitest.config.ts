import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

/**
 * Tests run in Node by default — the domain and both repository adapters need
 * nothing from a DOM, and `fake-indexeddb` is a pure JS implementation. The two
 * files that do need a window declare it themselves with
 * `// @vitest-environment jsdom`, which keeps the fast path fast.
 *
 * The SvelteKit plugin is here for two reasons: it resolves `$lib` and
 * `$app/*`, and it compiles `.svelte.ts` modules so runes work under test.
 */
export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**'],
      // Presentation is covered by eye, not by assertions.
      exclude: ['src/lib/**/*.svelte', 'src/lib/data/seed.json'],
    },
  },
});
