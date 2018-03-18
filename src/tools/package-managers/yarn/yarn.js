import PackageManager from '../_base/package-manager';
import { ApplicationManager } from '../../../editor/managers';

export default class YarnPackageManager extends PackageManager {
  constructor() {
    super('yarn');
  }

  howToInstall() {
    return 'https://yarnpkg.com/docs/install';
  }

  add(moduleName, options = { isGlobal: false, isDev: false }) {
    let args = ['add', moduleName];

    if (options.isGlobal) {
      args.unshift('global');
    }

    if (options.isDev) {
      args.push('--dev');
    }

    return ApplicationManager.environment.run(this.binNamespace, args);
  }

  remove(moduleName) {
    return ApplicationManager.environment.run(this.binNamespace, ['remove', moduleName]);
  }

  upgrade(moduleName) {
    return ApplicationManager.environment.run(this.binNamespace, ['upgrade', moduleName]);
  }
}
