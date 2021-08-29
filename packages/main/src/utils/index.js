import { dialog } from 'electron';
import { mainWindow } from '../';

async function folderDialog() {
  // @ts-ignore
  const dir = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (dir.canceled) return null;

  return dir.filePaths;
}

export { folderDialog };
