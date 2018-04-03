const filetree = require('../heavy-operations/filetree');

module.exports = {
  CURRENT_FILE_HAS_CHANGED: (event, filename, mainWindow) => {
    mainWindow.getRepresentedFilename() !== filename &&
      mainWindow.setRepresentedFilename(filename);
  },
  UPDATE_UNSAVED_CHANGES_STATUS: (event, edited, mainWindow) => {
    mainWindow.isDocumentEdited() !== edited &&
      mainWindow.setDocumentEdited(edited);
  },
  UPDATE_PROGRESS_BAR: (event, progress, mainWindow) => {
    mainWindow.setProgressBar(progress);
  },
  FETCH_FILE_TREE: (event, cwd, mainWindow) => {
    if (!mainWindow.isMaximized()) mainWindow.maximize();
    filetree(mainWindow, cwd);
  },
};
