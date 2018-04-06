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
  const cwd = event.data.cwd;
  spawnChild('which', [command], cwd, (error, success) => {
    event.source.postMessage({ type: 'which', command, success });
  });
}

function runEvent(event) {
  const wholeCommand = event.data.wholeCommand;
  const cwd = event.data.cwd;
  spawnChild(event.data.command, event.data.args, cwd, (error, success) => {
    event.source.postMessage({ type: 'run', wholeCommand, success });
  });
}

function spawnChild(command = '', args = [], cwd, callback) {
  const child = spawn(command, args, { cwd });

  child
    .on('error', error => {
      console.log('Error', error);
      callback(error, false);
    })
    .on('exit', () => callback(null, true));
}
