const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

app.setAppUserModelId("com.ljy97ya.electron");

log.transports.file.level = "info";
autoUpdater.logger = log;

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  // ▶ 첫화면
  win.loadFile(path.join(__dirname, "renderer", "start.html"));
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

// ── IPC: 버전 조회 / 업데이트 체크 트리거
ipcMain.handle("app:getVersion", () => app.getVersion());
ipcMain.on("updates:check", () => {
  if (win && !win.isDestroyed()) win.setProgressBar(0.5); // 가벼운 표시(선택)
  autoUpdater.checkForUpdates().catch(()=>{});
});

// ── 업데이트 이벤트 → 단일 채널로 타입만 전달(텍스트용)
function send(type, payload){ if (win && !win.isDestroyed()) win.webContents.send("updates:status", { type, payload }); }
autoUpdater.on("checking-for-update",   () => send("checking"));
autoUpdater.on("update-available",      (i) => send("available", i));
autoUpdater.on("update-not-available",  (i) => send("not-available", i));
autoUpdater.on("download-progress",     (p) => { if (win) win.setProgressBar((p.percent||0)/100); send("progress", p); });
autoUpdater.on("error",                 (e) => send("error", { message: e?.message || String(e) }));
autoUpdater.on("update-downloaded",     (i) => send("downloaded", i));
