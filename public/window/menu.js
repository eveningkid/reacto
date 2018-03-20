module.exports = (mainWindow) => ([
  { label: 'Hello World' },
  {
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
      {type: 'separator'},
      {role: 'quit'},
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'Find',
    submenu: [
      {
        label: 'Search',
        accelerator: 'CmdOrCtrl+F',
        click: () => mainWindow.webContents.send('search'),
      },
    ],
  },
  {
    label: 'Tools',
    submenu: [
      {
        label: 'Add Component',
        accelerator: 'CmdOrCtrl+Shift+F',
        click: () => mainWindow.webContents.send('focus-brick-selector'),
      },
      {
        label: 'Current File Component Preview',
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
            click: () => mainWindow.webContents.send('switch-package-manager-to-npm'),
          },
          {
            label: 'Switch to Yarn',
            click: () => mainWindow.webContents.send('switch-package-manager-to-yarn'),
          },
        ],
      },
    ],
  },
  {
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
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
    ]
  },
]);
