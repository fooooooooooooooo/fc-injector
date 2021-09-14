#!/usr/bin/node
const { build } = require('vite');
const { dirname } = require('path');

/** @type {'production' | 'development' | 'test'} */
const mode = (process.env.MODE = process.env.MODE || 'production');

const config = process.argv[2];

/**
 * Run `vite build` for config file
 */
function buildByConfig(/** @type {string} */ configFile) {
  return build({ configFile, mode });
}
(async () => {
  try {
    const totalTimeLabel = 'Total bundling time';
    console.time(totalTimeLabel);

    const consoleGroupName = `${dirname(config)}/`;
    console.group(consoleGroupName);

    const timeLabel = 'Bundling time';
    console.time(timeLabel);

    await buildByConfig(config);

    console.timeEnd(timeLabel);
    console.groupEnd();
    console.log('\n'); // Just for pretty print

    console.timeEnd(totalTimeLabel);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
