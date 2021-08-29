/** @type {import('vls').VeturConfig} */
module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
  },
  projects: [
    {
      root: './packages/renderer',
      jsconfig: './jsconfig.json',
      snippetFolder: './.vscode/vetur/snippets',
      globalComponents: [
        './src/components/**/*.vue',
      ],
    },
    {
      root: './packages/main',
      jsconfig: './jsconfig.json',
    },
    {
      root: './packages/preload',
      jsconfig: './jsconfig.json',
    },
  ],
};
