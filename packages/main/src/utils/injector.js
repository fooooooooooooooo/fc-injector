import fs from 'fs';
import path from 'path';

import { rootDir } from '../';
import {
  fileProtocolFeature,
  securityFeature,
  devtoolsFeature,
  multiInstanceFeature,
  transparencyFeature,
  transparencyFixFeature,
} from './features';

const injectorMark = 'FC2-INJECTOR';
const fcPreloadName = 'fcPreload';

// const devtoolsSnippet = 'mainWindow.openDevTools();';

const defaultFeatures = [fileProtocolFeature, securityFeature];

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
 * Inject feature
 * @param {string} main
 * @param {import('./features').Feature} feature
 * @returns {string} main
 */
function injectFeature(main, feature) {
  switch (feature.type) {
    case 'append':
      main = main.replace(
        feature.location,
        `${feature.location}\n${feature.feature}`,
      );
      break;
    case 'replace':
      main = main.replace(feature.location, feature.feature);
      break;
    default:
      throw new Error('Invalid feature type');
  }

  return main;
}

/**
 * Uninject feature
 * @param {string} main
 * @param {import('./features').Feature} feature
 * @returns {string} main
 */
function uninjectFeature(main, feature) {
  switch (feature.type) {
    case 'append':
      main = main.replace(
        `${feature.location}\n${feature.feature}`,
        feature.location,
      );
      break;
    case 'replace':
      main = main.replace(feature.feature, feature.location);
      break;
    default:
      throw new Error('Invalid feature type');
  }

  return main;
}

/**
 * Add feature to feature array without duplication
 * @param {import('./features').Feature[]} features
 * @param {import('./features').Feature} feature
 * @returns {import('./features').Feature[]} features
 */
function addFeature(features, feature) {
  if (!features.some((f) => f === feature)) {
    features.push(feature);
  }

  return features;
}

/**
 * @param {import('../../shared/typeDef').Config} config
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

  let features = defaultFeatures;

  if (config.enableDevtools === true) {
    features = addFeature(features, devtoolsFeature);
  }

  if (config.multiInstance === true) {
    features = addFeature(features, multiInstanceFeature);
  }

  if (config.transparency === true) {
    features = addFeature(features, transparencyFeature);
    features = addFeature(features, transparencyFixFeature);
  }

  features.forEach((feature) => {
    main = uninjectFeature(main, feature);
  });

  await fs.promises.writeFile(mainPath, main);
}

/**
 * @param {import('../../../shared/typeDef').Config} config
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

  let injectedPreload = '';

  // Injector specific preload code
  const injectorPreload = await fs.promises.readFile(
    path.join(rootDir, 'injectedPreload.js'),
    'utf8',
  );

  // Mark to identify preload
  injectedPreload = prependCode(injectedPreload, `//${injectorMark}`);

  // Path to css
  injectedPreload = appendCode(
    injectedPreload,
    `const cssPath = 'file:///${config.cssPath.split('\\').join('\\\\')}'`,
  );

  if(config.injectJs === true)
  injectedPreload = appendCode(
    injectedPreload,
    `const jsPath = 'file:///${config.jsPath.split('\\').join('\\\\')}'`,
  );

  injectedPreload = appendCode(injectedPreload, injectorPreload);

  // Runs original preload after injector preload has run
  injectedPreload = appendCode(
    injectedPreload,
    `require('./${fcPreloadName}')`,
  );

  await fs.promises.writeFile(preloadPath, injectedPreload);

  const mainPath = path.join(libPath, 'main.js');
  let main = await fs.promises.readFile(mainPath, 'utf8');

  let features = defaultFeatures;

  if (config.enableDevtools === true) {
    features = addFeature(features, devtoolsFeature);
  }

  if (config.multiInstance === true) {
    features = addFeature(features, multiInstanceFeature);
  }

  if (config.transparency === true) {
    features = addFeature(features, transparencyFeature);
    features = addFeature(features, transparencyFixFeature);
  }

  features.forEach((feature) => {
    main = injectFeature(main, feature);
  });

  await fs.promises.writeFile(mainPath, main);
}

export { inject, uninject, checkIfInjected };
