const { globalShortcut } = require('electron');

module.exports = function registerOtherShortcuts(mainWindow) {
  for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    globalShortcut.register(`CmdOrCtrl+${number}`, () => {
      mainWindow.webContents.send(`quick-file-switch-${number}`);
    });
  }
};
