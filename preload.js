const { contextBridge } = require("electron");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("appConfig", {
  read: () => {
    try {
      const p = path.join(process.cwd(), "config.json");
      return JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      return {};
    }
  }
});
