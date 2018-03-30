const spawn = require('child_process').spawn;

onmessage = event => {
  switch (event.data.type) {
    case 'which':
      whichEvent(event);
      break;

    case 'run':
      runEvent(event);
      break;

    default:
      console.warn('[Worker:onmessage] Unknown action type', event.data.type);
  }
};

function whichEvent(event) {
  const command = event.data.command;
  spawnChild('which', [command], (error, success) => {
    event.source.postMessage({ type: 'which', command, success });
  });
}

function runEvent(event) {
  const wholeCommand = event.data.wholeCommand;
  spawnChild(event.data.command, event.data.args, (error, success) => {
    event.source.postMessage({ type: 'run', wholeCommand, success });
  });
}

function spawnChild(command = '', args = [], callback) {
  const child = spawn(command, args);

  child
    .on('error', error => {
      console.log('Error', error);
      callback(error, false);
    })
    .on('exit', (code, signal) => callback(null, true));
}
