const { app, BrowserWindow, ipcMain } = require("electron");
const Store = require("electron-store");

const store = new Store();

function getPosition() {
  return (
    store.get("position") || {
      x: 100,
      y: 100,
      width: 320,
      height: 320,
    }
  );
}

let window;

ipcMain.on("position", (event, position) => {
  store.set("position", position);
  if (window) {
    console.log("setting bounds", position);
    window.setBounds(position);
  }
});

ipcMain.handle("getPosition", async (event) => {
  console.log(getPosition());
  return getPosition();
});

app.whenReady().then(() => {
  const position = getPosition();
  console.log(position);
  window = new BrowserWindow({
    title: "Webcam Reminder",
    width: position.width,
    height: position.height,
    titleBarStyle: "hiddenInset",
    alwaysOnTop: true,
    x: position.x,
    y: position.y,
    fullscreenable: false,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  window.loadURL(`file://${__dirname}/index.html`);

  window.on("move", () => {
    console.log('MOVE');
    const position = getPosition();
    window.setBounds(position);
  });
});
