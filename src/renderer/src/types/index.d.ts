/* eslint-disable no-var */

declare global {
  interface Window {
    ipcRenderer: Electron.IpcRenderer;
  }
}

export {};
