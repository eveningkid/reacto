import { getState } from '@rematch/core';
import { FileTreeManager, FileSystemManager } from '../../../editor/managers';
import config from '../../../config';
const prettier = window.require('prettier');
const path = window.require('path');

class PrettierFormatter {
  constructor() {
    this.name = 'prettier';
    this.configuration = null;
    this.configurationFilePath = null;
  }

  loadConfiguration = async () => {
    return await this.resolveConfig();
  }

  getCwd = () => getState().project.cwd;

  /**
   * Format the current file or text selection.
   */
  format = async () => {
    let options = await this.resolveConfig();
    if (!options) options = await this.createConfigurationFile();
    const editor = getState().session.editor;
    const code = editor.getValue();
    return prettier.format(code, options);
  }

  /**
   * Try to resolve configuration object.
   */
  resolveConfig = async () => {
    const cwd = this.getCwd();
    const prettierConfiguration = await prettier.resolveConfig(cwd);
    await prettier.clearConfigCache();
    return prettierConfiguration;
  }

  /**
   * Create a configuration file if none exists yet.
   */
  createConfigurationFile = async () => {
    if (!this.configuration) {
      const configurationFilePath = path.join(this.getCwd(), '.prettierrc');
      const defaultConfiguration = this.generateConfig();
      await FileSystemManager.writeFile(configurationFilePath, defaultConfiguration);
      this.configuration = {};
      this.configurationFilePath = configurationFilePath;
    }
    return this.configuration;
  }

  /**
   * Find the absolute path to the configuration file.
   */
  findConfigurationFilePath = () => {
    if (!this.configurationFilePath) {
      let configurationFilePath = FileTreeManager.findOne(/.prettierrc/g);
      if (configurationFilePath) {
        this.configurationFilePath = path.join(this.getCwd(), configurationFilePath);
      }
    }
    return this.configurationFilePath;
  }

  generateConfig = (configuration = {}) => {
    // Mix Prettier defaults with given configuration
    const finalConfiguration = {
      ...config().prettier.config,
      ...configuration,
    };

    const lines = [];
    for (const option of Object.entries(finalConfiguration)) {
      lines.push(option.join(': '));
    }
    return lines.join('\n');
  }


  /**
   * Update an option from configuration.
   *
   * @param {string} key path to option
   * @param {any} value
   */
  updateConfiguration = async (key, value) => {
    let configurationFilePath = this.findConfigurationFilePath();

    if (!configurationFilePath) {
      await this.createConfigurationFile();
      configurationFilePath = this.findConfigurationFilePath();
    }

    // aa.bb.whatWeWant
    key = key.substr(key.lastIndexOf('.') + 1);

    const content = this.generateConfig({ [key]: value });
    FileSystemManager.writeFile(configurationFilePath, content);
  }
}

export default PrettierFormatter;
