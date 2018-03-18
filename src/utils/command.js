const spawn = window.require('cross-spawn');
export const exec = window.require('atom-linter').exec;
export const execNode = window.require('atom-linter').execNode;

class Command {
  constructor(bin, args) {
    this.spawner = spawn(bin, args);
    this.spawner.stdout.setEncoding('utf8');
    this.spawner.stderr.setEncoding('utf8');
    return this;
  }

  onErrorBefore(callback) {
    this.spawner.on('error', callback);
    return this;
  }

  on(event, callback) {
    if (event === 'exit') {
      this.spawner.on(event, callback);
    } else {
      this.spawner.stdout.on(event, (data) => callback(null, data));
      this.spawner.stderr.on(event, (err) => callback(err));
    }
    return this;
  }

  stop(signal) {
    this.spawner.kill(signal);
  }
}

export function command(bin, args) {
  return new Command(bin, args);
}
