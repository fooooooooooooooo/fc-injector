const {
  app, BrowserWindow, ipcMain, dialog,
} = require('electron');
const path = require('path');
const fs = require('fs');

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let rootDir = app.getAppPath();
const last = path.basename(rootDir);
if (last === 'app.asar') {
  rootDir = path.dirname(app.getPath('exe'));
}

const injector = require('./injector');

let config = {
  fightcadePath: '',
  cssPath: '',
};

const configPath = path.join(rootDir, 'config.json');

function saveConfig() {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function loadConfig() {
  if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

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

  config.fightcadePath = selected;

  event.sender.send('browse-fc-directory_response', selected);
});

ipcMain.on('browse-css-directory', async (event) => {
  let selected = await folderDialog();

  if (selected === null) return;

  selected = path.join(selected, 'user.css');

  config.cssPath = selected;

  event.sender.send('browse-css-directory_response', selected);
});

ipcMain.on('get-config', (event) => {
  event.sender.send('get-config_response', config);
});

ipcMain.on('save-config', (event, data) => {
  const newConf = data;
  if (newConf === null || newConf.fightcadePath === null || newConf.cssPath === null) return;

  config = newConf;
  saveConfig();
});

ipcMain.on('inject', (event) => {
  try {
    injector.inject(config.fightcadePath, config.cssPath);
  } catch (e) {
    event.sender.send('injector-error', e);
  }
});

ipcMain.on('uninject', (event) => {
  try {
    injector.uninject(config.fightcadePath);
  } catch (e) {
    event.sender.send('injector-error', e);
  }
});

ipcMain.on('check-injected', (event) => {
  try {
    const isInjected = injector.checkIfInjected(config.fightcadePath);
    event.sender.send('check-injected_response', isInjected);
  } catch (e) {
    event.sender.send('injector-error', e);
  }
});

ipcMain.on('save-css', (event, data) => {
  fs.writeFileSync(config.cssPath, data);
});

ipcMain.on('get-css', (event) => {
  if (!fs.existsSync(config.cssPath)) return;
  const css = fs.readFileSync(config.cssPath, 'utf-8');
  event.sender.send('get-css_response', css);
});
