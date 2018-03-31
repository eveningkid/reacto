import { dispatch } from '@rematch/core';
import { EventsManager } from '.';
import { PrettierFormatter } from '../../tools/formatters';
import config from '../../config';
const log = window.require('electron-log');

EventsManager.on('update-file-tree', () => {
  /**
   * Any time the file tree is updated, we need to update the current
   * configuration for formatter—if any.
   */
  FormatterManager.loadConfiguration();
});

class FormatterManager {
  static formatter = new PrettierFormatter();

  static format = async () => {
    try {
      const generatedCode = await FormatterManager.formatter.format();
      dispatch.session.updateGeneratedCode({ generatedCode });
    } catch (error) {
      log.warn('[Error] Formatter: Could not parse code.');
    }
  };

  static tryFormatOnSave = async () => {
    if (!config().formatter.formatOnSave) return;
    await FormatterManager.format();
  };

  static loadConfiguration = async () => {
    const formatter = FormatterManager.formatter;
    const configuration = await formatter.loadConfiguration();

    if (configuration) {
      // Set local configuration from external file
      for (const [optionName, value] of Object.entries(configuration)) {
        const pathToOption = [formatter.name, 'config', optionName].join('.');
        // Only set options which are currently different from
        // the current configuration.
        if (
          config()._has(pathToOption) &&
          config()._get(pathToOption) !== value
        ) {
          config()._set(pathToOption, value);
        }
      }
    }
  };

  static updateConfiguration = (key, value) => {
    FormatterManager.formatter.updateConfiguration(key, value);
  };
}

export default FormatterManager;
