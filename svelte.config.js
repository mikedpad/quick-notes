import path from 'path';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    includePaths: [`node_modules`],
    scss: {
      includePaths: [`src/styles`],
    },
  }),
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: `#svelte`,
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
