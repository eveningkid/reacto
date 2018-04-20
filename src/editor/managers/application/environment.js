import { getState } from '@rematch/core';
const { spawn } = window.require('child_process');
const shell = window.require('shelljs');

/**
 * Helpers to communicate with the local environment.
 */
export default class Environment {
  getCWD = () => getState().project.cwd || '/';

  /**
   * Check if a command is available in local env
   *
   * @param {string} command
   * @return {Promise}
   */
  hasCommand(command = '') {
    return new Promise(resolve => {
      if (!command) resolve(true);
      const isCommandAvailable = shell.which(command);
      const success = !isCommandAvailable.includes('not found');
      resolve(success);
    });
  }

  /**
   * Run a command
   *
   * @param {string} command 'ls', 'node'
   * @param {Array[string]} args ['-al']
   * @return {Promise}
   */
  run(command = '', args = []) {
    return new Promise(resolve => {
      if (!command) resolve();
      this._spawn(command, args, (error, success) => resolve(success));
    });
  }

  /**
   * Spawn child process.
   * @param {string} command
   * @param {Array[string]} args
   * @param {Function} callback (error, success)
   */
  _spawn = (command = '', args = [], callback) => {
    const cwd = this.getCWD();
    const child = spawn(command, args, { cwd });

    child
      .on('error', error => {
        console.log('Error', error);
        callback(error, false);
      })
      .on('exit', () => callback(null, true));
  };
}
