import { dispatch, getState } from '@rematch/core';
import {
  ApplicationManager,
  NotificationManager,
  ParentProcessManager,
} from '../../../editor/managers';

const readPkgUp = window.require('read-pkg-up');
const watch = window.require('node-watch');

export default class PackageManager {
  constructor(binNamespace = '') {
    this.package = {
      dependencies: [],
      devDependencies: [],
      scripts: [],
    };

    this.watcher = null;
    this.pathToPackage = null;
    this.listeners = [];
    this.binNamespace = binNamespace;
  }

  update = () => {
    dispatch.project.updatePackageManager({ packageManager: this });

    ParentProcessManager.send(
      ParentProcessManager.actions.UPDATE_PACKAGE_MANAGER,
      this,
    );

    this.listeners.forEach((callback) => callback(this));
  }

  upgradeAll = async () => {
    try {
      await ApplicationManager.environment.run('yarn', ['upgrade',  '--latest']);
      NotificationManager.success('Upgraded all dependencies');
    } catch (error) {
      console.warn('[Error] When upgrading all dependencies');
      return error;
    }
  }

  onUpdate = (callback) => {
    this.listeners.push(callback);
  }

  run = () => {
    return new Promise((resolve) => {
      this.fetchPackage().then(() => {
        this.watch();
        resolve();
      });
    });
  }

  stop = () => {
    if (this.watcher) {
      this.watcher.close();
    }
  }

  fetchPackage = () => {
    return new Promise((resolve, reject) => {
      const { cwd } = getState().project;

      readPkgUp({ cwd })
        .then(({ pkg, path }) => {
          this.package = { ...this.package, ...pkg };
          this.pathToPackage = path;
          this.update();
        })
        .then(resolve);
    });
  }

  watch = () => {
    this.watcher = watch(this.pathToPackage);
    this.watcher.on('change', () => this.fetchPackage());
  }

  isInstalled = (moduleName) => {
    const allDependencies = this.dependencies
      .concat(this.devDependencies)
      .map(([name]) => name);

    return allDependencies.includes(moduleName);
  }

  isAvailable = async () => {
    return await ApplicationManager.environment.hasCommand(this.binNamespace);
  }

  get allDependencies() {
    return [].concat(this.dependencies).concat(this.devDependencies);
  }

  get dependencies() {
    return Object.entries(this.package.dependencies);
  }

  get devDependencies() {
    return Object.entries(this.package.devDependencies);
  }

  get scripts() {
    return Object.entries(this.package.scripts);
  }

  // Interface
  howToInstall() {}
  add(moduleName, options = { isGlobal: false, isDev: false }) {}
  remove(moduleName) {}
  upgrade(moduleName) {}
}
