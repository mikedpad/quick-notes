import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Tailwind runs first so Skeleton's utilities exist by the time Svelte
  // components are compiled and their classes scanned.
  plugins: [tailwindcss(), sveltekit()],
});
