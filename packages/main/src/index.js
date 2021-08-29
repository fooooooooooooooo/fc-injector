import { app, BrowserWindow } from 'electron';
import path, { join, dirname, basename } from 'path';
import fs from 'fs';
import { URL } from 'url';
import { registerIpc } from '@/ipc';
import { loadConfig } from '@/utils/config';
import * as injector from '@/utils/injector';

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

let rootDir = app.getAppPath();
const last = basename(rootDir);
if (last === 'app.asar') {
  rootDir = dirname(app.getPath('exe'));
}

let config = {
  fightcadePath: '',
  cssPath: '',
  enableDevtools: false,
};

/**
 * @param {{ fightcadePath: string; cssPath: string; enableDevtools: boolean; }} conf
 */
function setConfig(conf) {
  config = conf;
}

loadConfig().then((conf) => setConfig(conf));

// Install "Vue.js devtools"
// @ts-ignore
if (import.meta.env.MODE === 'development') {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    // @ts-ignore
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      // @ts-ignore
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      }),
    )
    .catch((e) => console.error('Failed install extension:', e));
}

/**
 * @type {BrowserWindow | null}
 */
let mainWindow = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    autoHideMenuBar: true,
    icon: path.join(rootDir, 'buildResources', 'icon.png'),
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      // @ts-ignore
      contextIsolation: import.meta.env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      // @ts-ignore
      enableRemoteModule: import.meta.env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
    },
  });

  registerIpc();

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    // @ts-ignore
    // eslint-disable-next-line no-constant-condition
    if (import.meta.env.MODE === 'development' && false) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    // @ts-ignore
    import.meta.env.MODE === 'development' &&
    // @ts-ignore
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? // @ts-ignore
        import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          '../renderer/dist/index.html',
          'file://' + __dirname,
        ).toString();

  await mainWindow.loadURL(pageUrl);
};

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error('Failed create window:', e));

// Auto-updates
// @ts-ignore
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error('Failed check updates:', e));
}

async function loadCss() {
  if (!fs.existsSync(config.cssPath)) return;
  const css = await fs.promises.readFile(config.cssPath, 'utf-8');
  return css;
}

/**
 * @param {string} css
 */
async function saveCss(css) {
  fs.promises.writeFile(config.cssPath, css, 'utf-8');
}

/**
 * @returns {Promise<boolean>} Success
 */
async function inject() {
  await injector.inject(config);
  return await injector.checkIfInjected(config.fightcadePath);
}

/**
 * @returns {Promise<boolean>} Success
 */
async function uninject() {
  await injector.uninject(config);
  return !(await injector.checkIfInjected(config.fightcadePath));
}

/**
 * @returns {Promise<boolean>} Is injected
 */
async function getInjected() {
  return await injector.checkIfInjected(config.fightcadePath);
}

export {
  mainWindow,
  rootDir,
  config,
  setConfig,
  loadCss,
  saveCss,
  inject,
  uninject,
  getInjected,
};
