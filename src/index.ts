import { app, BrowserWindow, ipcMain } from 'electron';
import { set_note as db_set_note, get_all_notes } from './database/db';
import type { INoteData } from './shared/types';

// Forge Webpack entries
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  if (process.platform === 'darwin') mainWindow.setWindowButtonVisibility(true);

  mainWindow.webContents.openDevTools();

  get_all_notes((data: INoteData[]) => {
    mainWindow.webContents.send('onstart-notes-data', data);
  });

 
  

  // Ventana
  ipcMain.on('close-app', () => mainWindow.close());
  ipcMain.on('maximize-app', () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  ipcMain.on('minimize-app', () => mainWindow.minimize());

  // Notas (SQLite)
  ipcMain.handle('set-note', async (_ev, argz: INoteData) => {
    //eval.sender.send()
    return await new Promise<INoteData[]>((res, rej) => {
      try {
        db_set_note(argz, (rows: INoteData[]) => res(rows));
      } catch (e) {
        rej(e);
      }
    });
  });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
