const path = require('path');
const fs = require('fs');

function handleCommandLine(mainWindow) {
  let directory;
  if (path.isAbsolute(process.argv[1])) {
    directory = process.argv[1];
  } else {
    directory = path.join(process.cwd(), process.argv[1]);
  }
  if (fs.lstatSync(directory).isDirectory()) {
    if (mainWindow) {
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('switch-project', directory);
      });
    }
  }
  process.exit(0);
}

module.exports = (is, mainWindow) => {
  if (!is.dev() && process.argv[1]) {
    handleCommandLine(mainWindow);
  }
};
