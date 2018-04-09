import { getState } from '@rematch/core';
import project from './project';
import Environment from './environment';

const environment = new Environment();

/**
 * Aim to represents the application itself.
 * Useful for external plugins and recipes to easily interact with the editor.
 */
export default class ApplicationManager {
  static get environment() {
    return environment;
  }

  static get project() {
    const state = getState();
    return project(state.project, state);
  }

  static get session() {
    return getState().session;
  }

  /**
   * Will check every second if the app is ready.
   * When it's ready, call *callback*.
   * Will wait up to 30s.
   * IDEA Could use Proxy instead
   */
  static ready(callback) {
    let attempts = 30;
    const isReadyInterval = setInterval(() => {
      const app = ApplicationManager;
      if (app.project.packageManager && app.project.taskRunner) {
        clearInterval(isReadyInterval);
        callback();
      } else if (attempts === 0) {
        clearInterval(isReadyInterval);
      } else {
        attempts--;
      }
    }, 1000);
  }
}
