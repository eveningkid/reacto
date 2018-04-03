module.exports = function registerOtherShortcuts(mainWindow) {
  const shortcuts = {};
  for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    shortcuts[`CmdOrCtrl+${number}`] = () => {
      mainWindow.webContents.send(`quick-file-switch-${number}`);
    };
  }
  return shortcuts;
};
