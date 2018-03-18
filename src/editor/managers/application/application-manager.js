import { getState } from '@rematch/core';
import project from './project';
import Environment from './environment';
// import toto from '../../hint';

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
}
