import { exec } from '../../../utils';
const which = window.require('which');

const execOptions = {
  ignoreExitCode: true,
  throwOnStderr: false,
  timeout: 120 * 1000, // 2 min in ms
};

/**
 * Helpers to communicate with the local environment.
 */
export default class Environment {
  /**
   * Check if a command is available in local env
   *
   * @param {string} command
   * @return {boolean}
   */
  hasCommand(command = '') {
    return new Promise((resolve, reject) => {
      which(command, (err, resolvedPath) => {
        if (err) return resolve(false);
        if (resolvedPath) return resolve(true);
      });
    });
  }

  /**
   * Run a command
   * TODO catch shouldn't resolve
   *
   * @param {string} command 'ls', 'node'
   * @param {Array[string]} args ['-al']
   * @return
   */
  run(command = '', args = [], options = {}) {
    return new Promise((resolve, reject) => {
      exec(command, args, { ...execOptions, ...options })
        .then((output) => resolve(output))
        .catch((output) => resolve(output));
    });
  }
}
