import fs from 'fs';
import { join } from 'path';
import { rootDir } from '../';

import { setConfig } from '../';

const defaultConfig = {
  fightcadePath: '',
  cssPath: '',
  enableDevtools: false,
};

async function loadConfig() {
  const configPath = join(rootDir, 'config.json');

  if (!fs.existsSync(configPath))
    fs.promises.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));

  const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));

  return config;
}

/**
 * @param { { fightcadePath: string, cssPath: string; enableDevtools: boolean } } config
 */
async function saveConfig(config) {
  const configPath = join(rootDir, 'config.json');

  const data = JSON.stringify(config, null, 2);

  await fs.promises.writeFile(configPath, data);
  setConfig(config);
}

export { loadConfig, saveConfig };
