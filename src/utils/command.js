// export const exec = window.require('atom-linter').exec;
const nativeExec = window.require('child_process').exec;

class Command {
  constructor(bin = '', args = [], options = {}) {
    this.bin = bin;
    this.args = args;
    this.options = options;
    return this;
  }

  run() {
    return new Promise((resolve, reject) => {
      nativeExec(
        [this.bin, ...this.args].join(' '),
        this.options,
        (error, stdout, stderr) => {
          if (error) reject(error);
          resolve(stdout);
        }
      );
    });
  }
}

export function command(bin, args, options) {
  return new Command(bin, args, options).run();
}
