import { contextBridge, ipcRenderer } from 'electron';
import type { INoteData } from './shared/types';
import { broadcast_event } from './shared/events';


ipcRenderer.on('onstart-notes-data', (ev, data) => {
  document.onreadystatechange = (ev) => {
    console.log("event onreadystatechange", ev);
    setTimeout(() => {
      window.dispatchEvent(broadcast_event('all-notes-data', data));
    }, 0);
  };
});


const renderer = {
  closeApp: () => ipcRenderer.send('close-app'),
  maximizeApp: () => ipcRenderer.send('maximize-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),

  set_note: async (data: INoteData, explicit = false): Promise<INoteData[]> => {
    const notes = await ipcRenderer.invoke('set-note', data);
    if (explicit) {
      window.dispatchEvent(broadcast_event('all-notes-data', notes));
    }
    return notes;
  },
};

contextBridge.exposeInMainWorld('electron', renderer);
export type IRenderer = typeof renderer;
