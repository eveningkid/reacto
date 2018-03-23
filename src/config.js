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
  'editor.vim': false,
  'startup.openLastOpenedProject': false,
  'notifications.blocked': false,
  'notifications.shouldBeSilent': true,
  'formatter.formatOnSave': false,
  'prettier.config.tabWidth': 2,
  'prettier.config.useTabs': false,
  'prettier.config.semi': true,
  'prettier.config.singleQuote': false,
  'prettier.config.trailingComma': 'none',
  'prettier.config.bracketSpacing': true,
  'prettier.config.jsxBracketSameLine': false,
  'prettier.config.arrowParens': 'avoid',
  'prettier.config.proseWrap': 'preserve',
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
  _has: key => appConfig.has(key),
  _get: key => appConfig.get(key),
});
