const {
  app, BrowserWindow, ipcMain, dialog,
} = require('electron');
const path = require('path');
const fs = require('fs');

let config = {
  fightcadePath: '',
  cssPath: '',
};

function saveConfig() {
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

function loadConfig() {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
}

const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    preload: path.join(__dirname, 'static', 'preload.js'),
  },
});

app.whenReady().then(() => {
  mainWindow.loadFile(path.join(__dirname, 'static', 'index.html'));

  loadConfig();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

async function folderDialog() {
  const dir = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (dir.canceled) return null;

  return dir.filePaths[0];
}

ipcMain.on('browse-fc-directory', async (event) => {
  const selected = await folderDialog();

  if (selected === null) return;

  event.sender.send('browse-fc-directory_response', selected);
});

ipcMain.on('browse-css-directory', async (event) => {
  const selected = await folderDialog();

  if (selected === null) return;

  event.sender.send('browse-css-directory_response', selected);
});

ipcMain.on('get-config', (event) => {
  event.sender.send('get-config_response', config);
});

ipcMain.on('save-config', (event, data) => {
  const newConf = JSON.parse(data);
  if (newConf === null || newConf.fightcadePath === null || newConf.cssPath === null) return;

  config = newConf;
  saveConfig();

  event.sender.send('save-config_response');
});
