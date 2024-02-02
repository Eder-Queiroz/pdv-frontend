const { app, BrowserWindow } = require("electron");
const next = require("next");
const { spawn } = require("child_process");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

function setup() {
  console.log("Inicializando...");

  const child = spawn("npm run dev", [], {
    detached: true,
    cwd: __dirname,
    shell: true,
    stdio: "inherit",
  });

  child.unref();

  return child;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win
    .loadURL(`http://localhost:3001`)
    .then((response) => console.log("resposta: ", response))
    .catch((err) => console.log("error: ", err));

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  const child = setup();
  nextApp.prepare().then(() => {
    createWindow();
    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
