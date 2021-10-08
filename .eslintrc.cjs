module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  root: true,
  plugins: ['svelte3', '@typescript-eslint'],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  ignorePatterns: ['*.cjs'],
  rules: {
    'no-bitwise': [
      2,
      {
        int32Hint: true,
      },
    ],
    'no-nested-ternary': 0,
    'no-plusplus': [
      0,
      {
        int32Hint: true,
      },
    ],
    'no-unused-expressions': [
      2,
      {
        allowTernary: true,
      },
    ],
    quotes: [
      2,
      'backtick',
      {
        avoidEscape: true,
      },
    ],
  },
};
