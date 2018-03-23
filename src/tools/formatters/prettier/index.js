import { getState } from '@rematch/core';
import { FileTreeManager, FileSystemManager } from '../../../editor/managers';
import config from '../../../config';
const prettier = window.require('prettier');
const path = window.require('path');

class PrettierFormatter {
  constructor() {
    this.configuration = null;
    this.configurationFilePath = null;
  }

  format = async () => {
    const options = await this.resolveConfig();
    const editor = getState().session.editor;
    const selection = editor.getDoc().getSelection();

    if (selection.length > 0) {
      // TODO
      // allow formatting only selection
      // options.rangeStart
      // options.rangeEnd
    }

    const code = editor.getValue();
    return prettier.format(code, options);
  }

  resolveConfig = async () => {
    const cwd = getState().project.cwd;
    const configuration = await prettier.resolveConfig(cwd);

    if (configuration) {
      this.configuration = configuration;
    } else {
      // Create configuration file
      const configurationFilePath = path.join(cwd, '.prettierrc');
      await FileSystemManager.writeEmptyFile(configurationFilePath);
      this.configuration = {};
      this.configurationFilePath = configurationFilePath;
    }

    if (!this.configurationFilePath) {
      let configurationFilePath = FileTreeManager.findOne(/.prettierrc/g);
      if (configurationFilePath) {
        configurationFilePath = path.join(cwd, configurationFilePath);
      }
    }

    return this.configuration;
  }

  generateConfig = (configuration) => {

  }

  updateConfig = async () => {
    const configuration = await this.resolveConfig();
    const mergeWithConfiguration = config().prettier.config;
    const content = this.generateConfig(mergeWithConfiguration);
    FileSystemManager.writeFile(this.configurationFilePath, content);
  }
}

export default PrettierFormatter;
