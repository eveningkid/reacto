import { dispatch, getState } from '@rematch/core';
import TaskRunner from '../_base/task-runner';
import Task from '../_base/task';

export default class NpmTaskRunner extends TaskRunner {
  constructor() {
    super();
    this.runningTasks = [];
    this.packageManager.onUpdate(() => this.update());
  }

  update = () => {
    dispatch.project.updateTaskRunner({ taskRunner: this });
  };

  run = scriptName => {
    const command = `yarn run ${scriptName}`;
    const task = new Task(scriptName, command);
    this.runningTasks.push(task);
    this.update();

    return new Promise(resolve => {
      task
        .run()
        .then(() => {
          this.stop(scriptName);
          resolve();
        })
        .catch(() => {
          this.error(scriptName);
          resolve();
        });
    });
  };

  stop = scriptName => {
    let stoppedTaskIndex = null;

    for (let i = 0; i < this.runningTasks.length; i++) {
      const task = this.runningTasks[i];
      if (task.scriptName === scriptName) {
        task.stop();
        stoppedTaskIndex = i;
      }
    }

    if (!isNaN(stoppedTaskIndex)) {
      this.runningTasks.splice(stoppedTaskIndex, 1);
      this.update();
    }
  };

  error = (scriptName /*, log*/) => {
    this.stop(scriptName);
    console.log('Error for', scriptName);
  };

  get packageManager() {
    return getState().project.packageManager;
  }

  availableTasks = () => {
    return this.packageManager.scripts;
  };
}
