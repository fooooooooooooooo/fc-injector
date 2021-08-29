import { contextBridge, ipcRenderer } from 'electron';
import path from 'path';
/**
 * If contextIsolated enabled use contextBridge
 * Else die.
 *
 * Note: Spectron tests can't work in isolated context
 * @see https://github.com/electron-userland/spectron/issues/693#issuecomment-748482545
 */
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (/** @type {string} */ channel, /** @type {any} */ data) => {
      ipcRenderer.send(channel, data);
    },
    receive: (/** @type {string} */ channel, /** @type {any} */ func) => {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
  });

  contextBridge.exposeInMainWorld('path', path);
}

// Need for Spectron tests
// eslint-disable-next-line no-undef
window.electronRequire = require;
