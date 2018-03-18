const { ipcRenderer } = window.require('electron');

class EventsManager {
  /**
   * Register a listener on 'channel'
   *
   * @param {string} channel
   * @param {function} callback
   * @example EventsManager.on('focus-brick-selector', () => console.log(64))
   */
  static on(channel, callback) {
    return ipcRenderer.on(channel, callback);
  }
}

export default EventsManager;
