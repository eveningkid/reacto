const Store = window.require('electron-store');

export const appConfig = new Store({
  name: 'app_config',
  encryptionKey: 'honey',
});

const staticConfig = {
  appName: 'Reacto',
  localStorePath: appConfig.path,
};

const defaultPreferences = {
  'startup.openLastOpenedProject': false,
  'notifications.blocked': false,
  'notifications.shouldBeSilent': true,
};

for (const [key, value] of Object.entries(defaultPreferences)) {
  if (!appConfig.has(key)) {
    appConfig.set(key, value);
  }
}

export default () => ({
  ...staticConfig,
  ...appConfig.store,
  _store: appConfig,
  _set: (key, value) => appConfig.set(key, value),
  _has: (key) => appConfig.has(key),
  _get: (key) => appConfig.get(key),
});
