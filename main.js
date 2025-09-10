const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.allowPrerelease = true; // 베타도 허용 (원하면 false)

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1000, height: 700,
    webPreferences: { preload: path.join(__dirname, "preload.js") }
  });
  win.loadFile(path.join(__dirname, "renderer", "index.html"));
  // 앱 시작 시 자동 확인 (버튼도 따로 제공)
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

// 제목에 버전 표시 (기본명: my fantasy)
app.on("browser-window-created", (_, window) => {
  const v = app.getVersion();
  window.webContents.on("did-finish-load", () => {
    try {
      const base = window.getTitle() || "my fantasy";
      window.setTitle(`${base} v${v}`);
    } catch {}
  });
});

// IPC: 렌더러에서 업데이트 확인 요청
ipcMain.on("update:check", () => {
  autoUpdater.checkForUpdates();
});

// IPC: 앱 버전 요청
ipcMain.handle("app:getVersion", () => app.getVersion());

// Updater 이벤트를 렌더러로 전달
autoUpdater.on("update-available", () => {
  log.info("Update available");
  if (win && !win.isDestroyed()) win.webContents.send("update:available");
});
autoUpdater.on("download-progress", (p) => {
  if (win && !win.isDestroyed()) {
    win.setProgressBar(p.percent / 100);
    win.webContents.send("update:progress", p);
  }
});
autoUpdater.on("update-downloaded", () => {
  if (win && !win.isDestroyed()) win.webContents.send("update:downloaded");
  const choice = dialog.showMessageBoxSync(win, {
    type: "question",
    buttons: ["지금 재시작", "나중에"],
    defaultId: 0,
    message: "새 버전 다운로드 완료. 지금 재시작하여 업데이트할까요?"
  });
  if (choice === 0) autoUpdater.quitAndInstall();
});
