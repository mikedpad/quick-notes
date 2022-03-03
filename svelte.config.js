import path from 'path';
import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      // fallback: '200.html',
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
