const { ipcMain } = require('electron/main');
import constants from '@/../../shared/constants';
import { folderDialog } from '@/utils';
import { loadConfig, saveConfig } from '@/utils/config';
import { inject, uninject, getInjected, saveCss, loadCss } from '../';

async function registerIpc() {
  ipcMain.on(constants.cssBrowse, async (event) => {
    const location = await folderDialog();
    console.log(location);
    if (location === null) return;

    event.sender.send(
      constants.cssBrowse + constants.responseSuffix,
      location[0],
    );
  });

  ipcMain.on(constants.fcBrowse, async (event) => {
    const location = await folderDialog();
    console.log(location);
    if (location === null) return;

    event.sender.send(
      constants.fcBrowse + constants.responseSuffix,
      location[0],
    );
  });

  ipcMain.on(constants.cssSave, async (event, data) => {
    await saveCss(data);
  });

  ipcMain.on(constants.cssGet, async (event) => {
    event.sender.send(
      constants.cssGet + constants.responseSuffix,
      await loadCss(),
    );
  });

  ipcMain.on(constants.settingsSave, async (event, data) => {
    await saveConfig(data);
  });

  ipcMain.on(constants.settingsGet, async (event) => {
    const config = await loadConfig();

    event.sender.send(constants.settingsGet + constants.responseSuffix, config);
  });

  ipcMain.on(constants.inject, async (event) => {
    event.sender.send(constants.changingState);
    const success = await inject();
    event.sender.send(constants.inject + constants.responseSuffix, success);
  });

  ipcMain.on(constants.uninject, async (event) => {
    event.sender.send(constants.changingState);
    const success = await uninject();
    event.sender.send(constants.uninject + constants.responseSuffix, success);
  });

  ipcMain.on(constants.injectedGet, async (event) => {
    const injected = await getInjected();
    event.sender.send(
      constants.injectedGet + constants.responseSuffix,
      injected,
    );
  });
}

export { registerIpc };
