import fs from 'fs';
import path from 'path';

import { rootDir } from '../';

const injectorMark = 'FC2-INJECTOR';
const fcPreloadName = 'fcPreload';
const securityString = 'webSecurity: !options.insecure';
const insecurityString = 'webSecurity: false';

const newProtocol = `const {protocol} = require('electron');protocol.registerFileProtocol('file', (request, cb) => {
  const url = request.url.replace('file:///', '')
  const decodedUrl = decodeURI(url)
  try {
    return cb(decodedUrl)
  } catch (error) {
    console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
  }
})`;

const devtoolsSnippet = 'mainWindow.openDevTools();';

// After writing this I discovered that theres literally just a line that will inject a script
// on document loaded built into the original fc2 preload.js, I will refuse to use it because
// I spent a while writing this code, and it is not dependent on the original fc2 preload.js

/**
 * @param {string} fcPath
 */
function getLibPath(fcPath) {
  return path.join(fcPath, 'fc2-electron', 'resources', 'app', 'lib');
}

/**
 * @param {string} libPath
 */
function getPreloadPath(libPath) {
  return path.join(libPath, 'preload.js');
}

/**
 * @param {string} libPath
 */
function preloadExists(libPath) {
  return fs.existsSync(path.join(libPath, 'preload.js'));
}

/**
 * @param {string} libPath
 */
function libExists(libPath) {
  return fs.existsSync(libPath);
}

/**
 * @param {string} fcPath
 */
async function checkIfInjected(fcPath) {
  const libPath = getLibPath(fcPath);

  if (!libExists(libPath))
    throw new Error(
      'fightcade path is incorrect or fightcade installation is broken',
    );

  if (!preloadExists(libPath))
    throw new Error('preload.js does not exist, please reinstall fightcade');

  const preload = await fs.promises.readFile(getPreloadPath(libPath), 'utf8');

  return preload.startsWith(`//${injectorMark}`);
}

/**
 * @param {string} original
 * @param {string} toAppend
 */
function appendCode(original, toAppend) {
  return `${original}\n${toAppend}`;
}

/**
 * @param {string} original
 * @param {string} toPrepend
 */
function prependCode(original, toPrepend) {
  return `${toPrepend}\n${original}`;
}

/**
 * @param {{ fightcadePath: string; cssPath: string; enableDevtools: boolean; }} config
 */
async function uninject(config) {
  const libPath = getLibPath(config.fightcadePath);
  const preloadPath = getPreloadPath(libPath);
  const oldPreloadPath = path.join(libPath, `${fcPreloadName}.js`);

  if (!fs.existsSync(oldPreloadPath)) {
    throw new Error('old preload.js does not exist');
  }

  if (fs.existsSync(preloadPath)) {
    await fs.promises.unlink(preloadPath);
  }

  await fs.promises.rename(oldPreloadPath, path.join(libPath, 'preload.js'));

  const mainPath = path.join(libPath, 'main.js');
  let main = await fs.promises.readFile(mainPath, 'utf8');

  main = main.replace(insecurityString, securityString);

  main = main.replace(
    `app.on('ready', () => {\n${newProtocol}`,
    'app.on(\'ready\', () => {',
  );

  main = main.replace(
    `function createTrayIcon(nativefierOptions, mainWindow) {\n${devtoolsSnippet}`,
    'function createTrayIcon(nativefierOptions, mainWindow) {',
  );
  await fs.promises.writeFile(mainPath, main);
}

/**
 * @param {{ fightcadePath: string; cssPath: string; enableDevtools: boolean; }} config
 */
async function inject(config) {
  if (await checkIfInjected(config.fightcadePath)) await uninject(config);

  const libPath = getLibPath(config.fightcadePath);
  const preloadPath = getPreloadPath(libPath);

  await fs.promises.rename(
    preloadPath,
    path.join(libPath, `${fcPreloadName}.js`),
  );

  if (fs.existsSync(preloadPath)) {
    await fs.promises.unlink(preloadPath);
  }

  let injectorPreload = '';

  const injectedPreload = await fs.promises.readFile(
    path.join(rootDir, 'injectedPreload.js'),
    'utf8',
  );

  injectorPreload = prependCode(injectorPreload, `//${injectorMark}`);
  injectorPreload = appendCode(
    injectorPreload,
    `const cssPath = 'file:///${config.cssPath.split('\\').join('\\\\')}'`,
  );

  injectorPreload = appendCode(injectorPreload, injectedPreload);

  injectorPreload = appendCode(
    injectorPreload,
    `require('./${fcPreloadName}')`,
  );

  await fs.promises.writeFile(preloadPath, injectorPreload);

  const mainPath = path.join(libPath, 'main.js');
  let main = await fs.promises.readFile(mainPath, 'utf8');

  main = main.replace(securityString, insecurityString);

  main = main.replace(
    'app.on(\'ready\', () => {',
    `app.on('ready', () => {\n${newProtocol}`,
  );

  if (config.enableDevtools) {
    main = main.replace(
      'function createTrayIcon(nativefierOptions, mainWindow) {',
      `function createTrayIcon(nativefierOptions, mainWindow) {\n${devtoolsSnippet}`,
    );
  }

  await fs.promises.writeFile(mainPath, main);
}

export { inject, uninject, checkIfInjected };
