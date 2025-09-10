const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  checkForUpdates: () => ipcRenderer.send("update:check"),
  onUpdateAvailable: (cb) => ipcRenderer.on("update:available", () => cb?.()),
  onUpdateProgress: (cb) => ipcRenderer.on("update:progress", (_, p) => cb?.(p)),
  onUpdateDownloaded: (cb) => ipcRenderer.on("update:downloaded", () => cb?.()),
  getVersion: () => ipcRenderer.invoke("app:getVersion"),
});
