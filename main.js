const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const log = require("electron-log");
const { autoUpdater } = require("electron-updater");

log.transports.file.level = "info";
autoUpdater.logger = log;
autoUpdater.allowPrerelease = true; // 베타도 받을 거면 유지

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1000, height: 700,
    webPreferences: { preload: path.join(__dirname, "preload.js") }
  });
  // 존재하는 파일로 변경 가능
  win.loadFile(path.join(__dirname, "renderer", "index.html"));

  // 앱 시작 후 업데이트 체크+알림
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });

autoUpdater.on("update-available", () => {
  log.info("Update available");
});

autoUpdater.on("download-progress", (p) => {
  if (win && !win.isDestroyed()) {
    win.setProgressBar(p.percent / 100);
  }
});

autoUpdater.on("update-downloaded", () => {
  const choice = dialog.showMessageBoxSync(win, {
    type: "question",
    buttons: ["지금 재시작", "나중에"],
    defaultId: 0,
    message: "새 버전 다운로드 완료. 지금 재시작하여 업데이트할까요?"
  });
  if (choice === 0) autoUpdater.quitAndInstall();
});
/** === Show version in window title ===
 * 기존 app/BrowserWindow 선언을 그대로 사용합니다(재선언 없음).
 */
app.on("browser-window-created", (_, window) => {
  const v = app.getVersion();
  window.webContents.on("did-finish-load", () => {
    try {
      const base = window.getTitle() || "my fantasy";
      window.setTitle(`${base} v${v}`);
    } catch {}
  });
});

