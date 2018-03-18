const { ipcRenderer } = window.require('electron');

/**
 * Make our API for app-to-Electron communications more readable
 */
class ParentProcessManager {
  static actions = {
    CURRENT_FILE_HAS_CHANGED: 'CURRENT_FILE_HAS_CHANGED',
    UPDATE_TASK_RUNNER: 'UPDATE_TASK_RUNNER',
    UPDATE_PACKAGE_MANAGER: 'UPDATE_PACKAGE_MANAGER',
    UPDATE_UNSAVED_CHANGES_STATUS: 'UPDATE_UNSAVED_CHANGES_STATUS',
    UPDATE_PROGRESS_BAR: 'UPDATE_PROGRESS_BAR',
    FETCH_FILE_TREE: 'FETCH_FILE_TREE',
  };

  static send(channel, content) {
    ipcRenderer.send(channel, content);
  }
}

export default ParentProcessManager;
