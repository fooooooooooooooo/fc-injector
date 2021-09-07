import fs from 'fs';
import { join } from 'path';
import { rootDir } from '../';

import { setConfig } from '../';

const defaultConfig = {
  fightcadePath: '',
  cssPath: '',
  jsPath: '',
  enableDevtools: false,
  multiInstance: false,
  transparency: false,
  injectJs: false,
};

/**
 * Returns loaded config.json
 * @returns {Promise<import('../../../shared/typeDef').Config>}
 */
async function loadConfig() {
  const configPath = join(rootDir, 'config.json');

  if (!fs.existsSync(configPath))
    fs.promises.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));

  const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));

  return config;
}

/**
 * @param { import('../../../shared/typeDef').Config } config
 * @returns {Promise<void>}
 */
async function saveConfig(config) {
  const configPath = join(rootDir, 'config.json');

  const data = JSON.stringify(config, null, 2);

  await fs.promises.writeFile(configPath, data);
  setConfig(config);
}

export { loadConfig, saveConfig };
