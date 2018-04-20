const Store = window.require('electron-store');

export const appConfig = new Store({
  name: 'app_config',
  encryptionKey: 'honey',
});

// If, somehow, the store needs to be cleared
// appConfig.clear();

const staticConfig = {
  appName: 'Reacto',
  localStorePath: appConfig.path,
};

export const custom = {
  editor: [
    {
      name: 'Vim Mode',
      path: 'editor.vim',
      default: false,
    },
    {
      name: 'Font',
      path: 'editor.font',
      type: 'string',
      default: 'Fira Code',
    },
  ],
  notifications: [
    {
      name: 'Silent notifications',
      path: 'notifications.shouldBeSilent',
      default: true,
    },
    {
      name: 'Block notifications',
      path: 'notifications.blocked',
      default: false,
    },
  ],
  startup: [
    {
      name: 'Open last opened project',
      path: 'startup.openLastOpenedProject',
      default: false,
    },
  ],
  fileTree: [
    {
      name: 'Hide .dot documents',
      path: 'fileTree.hideDotDocuments',
      default: false,
    },
    {
      name: 'Hide git ignored files',
      path: 'fileTree.hideGitIgnoredFiles',
      default: false,
    },
    {
      name: 'Hide node modules',
      path: 'fileTree.hideNodeModules',
      default: true,
    },
  ],
  formatter: [
    {
      name: 'Format on save',
      path: 'formatter.formatOnSave',
      default: false,
    },
  ],
  prettier: [
    {
      name: 'Tab width',
      path: 'prettier.config.tabWidth',
      type: 'number',
      default: 2,
    },
    {
      name: 'Use tabs',
      path: 'prettier.config.useTabs',
      default: false,
    },
    {
      name: 'Semicolons',
      path: 'prettier.config.semi',
      default: true,
    },
    {
      name: 'Replace double quotes with single',
      path: 'prettier.config.singleQuote',
      default: false,
    },
    {
      name: 'Trailing commas',
      path: 'prettier.config.trailingComma',
      type: 'select',
      options: ['none', 'es5', 'all'],
      default: 'none',
    },
    {
      name: 'Bracket Spacing',
      path: 'prettier.config.bracketSpacing',
      default: true,
    },
    {
      name: 'JSX Brackets',
      path: 'prettier.config.jsxBracketSameLine',
      default: false,
    },
    {
      name: 'Arrow Function Parentheses',
      path: 'prettier.config.arrowParens',
      type: 'select',
      options: ['avoid', 'always'],
      default: 'avoid',
    },
    {
      name: 'Prose Wrap',
      path: 'prettier.config.proseWrap',
      type: 'select',
      options: ['preserve', 'always', 'never'],
      default: 'preserve',
    },
  ],
};

const customizableOptions = [
  ...custom.editor,
  ...custom.notifications,
  ...custom.fileTree,
  ...custom.startup,
  ...custom.formatter,
  ...custom.prettier,
];

for (const option of customizableOptions) {
  if (!appConfig.has(option.path)) {
    appConfig.set(option.path, option.default);
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
