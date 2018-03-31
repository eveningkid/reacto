const is = require('electron-is');
const { app, dialog } = require('electron');

const checkForUpdates = require('./updater');

const fullAppName = `${app.getName()} ${app.getVersion()}`;

module.exports = (app, mainWindow) => {
  let menu = [];

  if (is.macOS()) {
    menu.push({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    });
  }

  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click: () => mainWindow.webContents.send('new-file'),
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => mainWindow.webContents.send('save-file'),
      },
    ],
  };

  if (!is.macOS()) {
    fileMenu.submenu.push({ type: 'separator' });
    fileMenu.submenu.push({ role: 'quit' });
  }

  menu.push(fileMenu);

  menu.push({
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
      { type: 'separator' },
      {
        label: 'Prettify current file',
        accelerator: 'CmdOrCtrl+Alt+F',
        click: () => mainWindow.webContents.send('format-current-file'),
      },
    ],
  });

  menu.push({
    label: 'Find',
    submenu: [
      {
        label: 'Search',
        accelerator: 'CmdOrCtrl+F',
        click: () => mainWindow.webContents.send('search'),
      },
    ],
  });

  menu.push({
    label: 'Tools',
    submenu: [
      {
        label: 'Add Component',
        accelerator: 'CmdOrCtrl+Shift+F',
        click: () => mainWindow.webContents.send('focus-brick-selector'),
      },
      {
        label: 'Preview Current File Component',
        accelerator: 'CmdOrCtrl+R',
        click: () => mainWindow.webContents.send('component-preview'),
      },
      {
        label: 'Package Manager',
        submenu: [
          {
            label: 'Search Package Manager',
            accelerator: 'CmdOrCtrl+Shift+P',
            click: () => mainWindow.webContents.send('focus-package-manager'),
          },
          {
            label: 'Switch to NPM',
            click: () =>
              mainWindow.webContents.send('switch-package-manager-to-npm'),
          },
          {
            label: 'Switch to Yarn',
            click: () =>
              mainWindow.webContents.send('switch-package-manager-to-yarn'),
          },
        ],
      },
    ],
  });

  menu.push({
    label: 'View',
    submenu: [
      {
        label: 'Close Current File',
        accelerator: 'CmdOrCtrl+W',
        click: () => mainWindow.webContents.send('close-file'),
      },
      {
        label: 'Next Opened File',
        accelerator: 'Ctrl+Tab',
        click: () => mainWindow.webContents.send('quick-switch-tab-forward'),
      },
      {
        label: 'Previous Opened File',
        accelerator: 'Ctrl+Shift+Tab',
        click: () => mainWindow.webContents.send('quick-switch-tab-backward'),
      },
      { type: 'separator' },
      {
        label: 'Toggle File Tree',
        accelerator: 'Cmd+Ctrl+Left',
        click: () => mainWindow.webContents.send('toggle-ui-file-tree'),
      },
      {
        label: 'Toggle Brick Selector',
        accelerator: 'Cmd+Ctrl+Right',
        click: () => mainWindow.webContents.send('toggle-ui-brick-selector'),
      },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
    ],
  });

  menu.push({
    role: 'window',
    submenu: [{ role: 'minimize' }],
  });

  const helpMenu = [
    {
      label: 'About',
      click: () => {
        const options = {
          type: 'info',
          buttons: ['OK'],
          defaultId: 1,
          title: fullAppName,
          message: fullAppName,
          detail: `Electron ${process.versions['electron']} - Chrome ${
            process.versions['chrome']
          } - Node.js ${process.versions['node']} - Arch ${process.arch}`,
        };

        dialog.showMessageBox(options);
      },
    },
  ];

  if (!is.dev()) {
    helpMenu.submenu.unshift({
      label: 'Check for updates',
      click: menuItem => checkForUpdates(menuItem),
    });
    helpMenu.submenu.unshift({ type: 'separator' });
  }

  menu.push({
    label: 'Help',
    submenu: helpMenu,
  });

  return menu;
};
