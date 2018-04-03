const electron = require('electron');
const sweet = require('sweet-electron')(electron);

// Fix $PATH on macOS
require('fix-path')();

const windowConfiguration = require('./window/configuration');
const menu = require('./window/menu');
const shortcuts = require('./window/shortcuts');
const events = require('./window/events');

sweet()
  .url(
    is =>
      is.dev() ? 'http://localhost:3000' : [__dirname, '../build/index.html']
  )
  .window(windowConfiguration)
  .menu(menu)
  .events(events)
  .shortcuts(shortcuts)
  .run();
