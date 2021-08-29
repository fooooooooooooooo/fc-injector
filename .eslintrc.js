module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: false,
  },
  globals: {
    ipcRenderer: false,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['node_modules/**', '**/dist/**'],
  rules: {
    semi: ['error', 'always'],
    /**
     * This will make the history of changes in the hit a little cleaner
     */
    'comma-dangle': ['warn', 'always-multiline'],
    quotes: ['warn', 'single'],
  },
};
