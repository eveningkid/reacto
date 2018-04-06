import { ApplicationManager } from '../../../editor/managers';

export default class Task {
  constructor(scriptName, command) {
    this.scriptName = scriptName;
    this.command = command;
  }

  run() {
    return new Promise((resolve, reject) => {
      const [bin, ...args] = this.command.split(' ');

      ApplicationManager.environment
        .run(bin, args)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  stop() {
    // TODO
  }
}
