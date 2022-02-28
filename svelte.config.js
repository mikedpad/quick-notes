import path from 'path';
import adapter from '@sveltejs/adapter-static';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sveltePreprocess({
    includePaths: [`node_modules`],
    scss: {
      includePaths: [`src/styles`],
    },
  }),
  kit: {
    adapter: adapter({
      precompress: true,
    }),
    vite: {
      resolve: {
        alias: {
          $data: path.resolve(`./src/data`),
          $images: path.resolve(`./src/images`),
        },
      },
    },
  },
};

export default config;
