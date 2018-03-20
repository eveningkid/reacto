const isDev = require('electron-is-dev');
const path = require('path');
const is = require('electron-is');
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");

const filetree = require('./heavy-operations/filetree');
const menuTemplate = require('./window/menu');

// TODO Sadly doesn't work
// This should be done in order to not display notifications,
// if "do not disturb" mode is activated.
// const { getDoNotDisturb } = require('macos-notification-state');

// Fix $PATH on macOS
require('fix-path')();

let mainWindow;
let packageManager;

const initialWindowConfiguration = {
  vibrancy: 'ultra-dark',
  show: false,
  useContentSize: true,
  center: true,
};

function createWindow() {
  mainWindow = new BrowserWindow(Object.assign({},
    initialWindowConfiguration,

    // Fix unavailable vibrancy on non-macOS devices
    !is.macOS() && {
      backgroundColor: '#7f7f7f',
    },
  ));

  mainWindow.loadURL(isDev ?
    'http://localhost:3000' :
    `file://${path.join(__dirname, '../build/index.html')}`
  );

  const builtMenu = menuTemplate(mainWindow);
  const menu = Menu.buildFromTemplate(builtMenu);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (app.setAboutPanelOptions) {
    app.setAboutPanelOptions({
      applicationName: "Reacto",
      applicationVersion: "0.0.1",
    });
  }
}

app.on('ready', () => {
  createWindow();

  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain
  .on('CURRENT_FILE_HAS_CHANGED', (event, filename) => {
    mainWindow
    && mainWindow.getRepresentedFilename() !== filename
    && mainWindow.setRepresentedFilename(filename);
  })
  .on('UPDATE_UNSAVED_CHANGES_STATUS', (event, edited) => {
    mainWindow
    && mainWindow.isDocumentEdited() !== edited
    && mainWindow.setDocumentEdited(edited);
  })
  .on('UPDATE_PROGRESS_BAR', (event, progress) => {
    mainWindow && mainWindow.setProgressBar(progress);
  })
  .on('FETCH_FILE_TREE', (event, cwd) => {
    if (mainWindow) {
      if (!mainWindow.isMaximized()) {
        mainWindow.maximize();
      }

      filetree(mainWindow, cwd);
    }
  })
  .on('UPDATE_PACKAGE_MANAGER', (event, newPackageManager) => {
    packageManager = newPackageManager;
  });
