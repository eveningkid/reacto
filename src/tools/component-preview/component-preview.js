import { ast } from '../../utils';
import { FileSystemManager } from '../../editor/managers';
import webpackConfigurator, { babelConfig } from './webpack-configurator';
const babel = window.require('babel-core');
const path = window.require('path');
const fs = window.require('fs');
const webpack = window.require('webpack');

export default class ComponentPreview {
  constructor(options) {
    this.options = options;
  }

  buildPreview = options => {
    return new Promise(async (resolve, reject) => {
      try {
        const originalFile = await this.fetchFile(options.filePath);
        const clonedFilePath = await this.prepareFileToCompile(
          options.filePath,
          originalFile
        );
        const { compiledFilePath } = await this.compileCode(clonedFilePath);
        const component = await this.fetchFile(compiledFilePath);

        this.componentSourceFilePath = clonedFilePath;
        this.componentBundlePath = compiledFilePath;

        const initPreview = new Function(component);
        initPreview();

        resolve({ success: true });
      } catch (error) {
        reject(error);
      }
    });
  };

  prepareFileToCompile = (originalFilePath, code) => {
    return new Promise((resolve, reject) => {
      const babeled = babel.transform(code, babelConfig);
      const classNode = ast.findClass(babeled.ast);
      const className = ast.classIdentifier(classNode);

      const content =
        code +
        '\n' +
        'require("react-dom")' +
        '.render(' +
        `<${className} />` +
        ', document.querySelector(".component-preview-content")' +
        ');';

      const filePath = path.resolve(
        path.dirname(originalFilePath),
        '_component-preview-source.js'
      );

      FileSystemManager.writeFile(filePath, content)
        .then(() => resolve(filePath))
        .catch(error => reject(error));
    });
  };

  compileCode = entryFilePath => {
    return new Promise(async (resolve, reject) => {
      const outputFilename = '_component-preview-bundle.js';
      const compiledFilePath = path.join(this.options.cwd, outputFilename);

      const webpackConfig = webpackConfigurator({
        cwd: this.options.cwd,
        entryFilePath,
        outputFilename,
      });

      webpack(webpackConfig).run((err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve({ compiledFilePath, stats });
        }
      });
    });
  };

  stop = async () => {
    try {
      // Delete temporary files
      if (
        !this.isDeletingFiles &&
        this.componentSourceFilePath &&
        this.componentBundlePath
      ) {
        this.isDeletingFiles = true;
        await this.deleteFile(this.componentSourceFilePath);
        await this.deleteFile(this.componentBundlePath);
        this.componentSourceFilePath = null;
        this.componentBundlePath = null;
        this.isDeletingFiles = false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  fetchFile = filePath => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  deleteFile = filePath => {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, err => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  };
}
