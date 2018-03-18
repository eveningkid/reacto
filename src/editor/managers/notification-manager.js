import config from '../../config';

class NotificationManager {
  /**
   * @param {string} title
   * @param {string} message
   * @param {number} duration in seconds, how long should the notification be displayed
   */
  static success(message, duration = 7) {
    const options = {
      body: message,
      // icon: , TODO
      silent: config().notifications.shouldBeSilent,
    };

    if (this.canNotificate()) {
      const notification = new Notification(config().appName, options);
      setTimeout(() => notification.close(), duration * 1000);
    }
  }

  /**
   * Detect whether the notification can be spread:
   * - window isn't focused
   */
  static canNotificate() {
    return !document.hasFocus() && !config().notifications.blocked;
  }
}

export default NotificationManager;
