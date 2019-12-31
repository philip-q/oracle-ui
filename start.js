const electron = require('electron');
const app = electron.app;
const dialog = electron.dialog;
const { BrowserWindow } = electron;

const path = require('path');
const isDev = require('electron-is-dev');
require('electron-reload');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        // width: 800,
        // height: 600,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    let url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    console.log("url is : ", url);
    mainWindow.loadURL(url);

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});

