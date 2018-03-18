import { dispatch, getState } from '@rematch/core';
import Task from '../_base/task';
import { ParentProcessManager } from '../../../editor/managers';

export default class NpmTaskRunner {
  constructor() {
    this.runningTasks = [];
    this.packageManager.onUpdate(() => this.update());
  }

  update = () => {
    dispatch.project.updateTaskRunner({ taskRunner: this });
    ParentProcessManager.send(ParentProcessManager.actions.UPDATE_TASK_RUNNER, this);
  }

  run = (scriptName, command) => {
    const task = new Task(scriptName, command, this);
    task.run();
    this.runningTasks.push(task);
    this.update();
  }

  stop = (scriptName) => {
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
  }

  error = (scriptName, log) => {
    this.stop(scriptName);
    console.log('Error for', scriptName);
  }

  get packageManager() {
    return getState().project.packageManager;
  }

  availableTasks = () => {
    return this.packageManager.scripts;
  }
}
