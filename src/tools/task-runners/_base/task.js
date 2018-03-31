import { ApplicationManager } from '../../../editor/managers';

export default class Task {
  constructor(scriptName, command, parent) {
    this.scriptName = scriptName;
    this.command = command;
    this.parent = parent;
  }

  run() {
    const [bin, ...args] = this.command.split(' ');

    ApplicationManager.environment
      .run(bin, args)
      .then(() => this.parent.stop(this.scriptName))
      .catch(() => this.parent.error(this.scriptName));
  }

  stop() {}
}
