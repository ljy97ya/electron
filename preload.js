const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("app", {
  getVersion: () => ipcRenderer.invoke("app:getVersion")
});

contextBridge.exposeInMainWorld("updates", {
  check: () => ipcRenderer.send("updates:check"),
  onStatus: (cb) => ipcRenderer.on("updates:status", (_e, d) => cb(d.type, d.payload))
});
