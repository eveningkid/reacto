const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const ignoredFileNames = [
  '.DS_Store',
  '_component-preview-source.js',
  '_component-preview-bundle.js',
  'node_modules',
];

let watcher;
let updateTimeout;

/**
 * Prevent from multiple file tree updates within a short time (< 1.5s).
 */
function waitForUpdate(mainWindow, cwd) {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }

  updateTimeout = setTimeout(() => {
    updateFileTree(mainWindow, createFileTree(cwd));
  }, 1500);
}

function createFileTree(src) {
  let currentNode = {};

  fs.readdirSync(src).forEach(file => {
    if (!ignoredFileNames.includes(file)) {
      const pathToFile = path.join(src, file);
      try {
        const fileStat = fs.statSync(pathToFile);

        if (fileStat.isDirectory()) {
          currentNode[file] = createFileTree(pathToFile);
        } else {
          currentNode[file] = null;
        }
      } catch (e) {
        /* don't crash, but don't care about error */
      }
    } else {
      // Ignored `file`
    }
  });

  return currentNode;
}

function updateFileTree(mainWindow, fileTree) {
  mainWindow.webContents.send('update-file-tree', fileTree);
}

module.exports = (mainWindow, cwd) => {
  // Already started watching.
  // Can happen because of HMR or another project has been opened.
  if (watcher) {
    watcher.close();
  }

  const fileTree = createFileTree(cwd);
  updateFileTree(mainWindow, fileTree);

  watcher = chokidar.watch(cwd, {
    ignored: /node_modules/,
    usePolling: true,
    cwd,
  });

  watcher.on('ready', () => {
    watcher
      .on('add', () => waitForUpdate(mainWindow, cwd))
      .on('change', path => {
        // Check if it's only a rename action
        let currentNode = fileTree;
        const pathToFile = path.split('/').slice(0, -1);
        for (const part of pathToFile) currentNode = currentNode[part];
        if (!currentNode) waitForUpdate(mainWindow, cwd);
      })
      .on('unlink', () => waitForUpdate(mainWindow, cwd));
  });
};
