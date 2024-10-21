const { contextBridge, ipcRenderer } = require('electron');

// 暴露 IPC 方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    minimizeWindow: () => ipcRenderer.send('minimize-window')
});
