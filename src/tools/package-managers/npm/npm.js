import PackageManager from '../_base/package-manager';
import { ApplicationManager } from '../../../editor/managers';

export default class NpmPackageManager extends PackageManager {
  constructor() {
    super('npm');
  }

  howToInstall() {
    // npm should be installed by default as it comes with node
    return 'https://docs.npmjs.com/getting-started/installing-node';
  }

  add(moduleName, options = { isGlobal: false, isDev: false }) {
    let args = ['install', '--silent'];

    if (options.isGlobal) {
      args.push('-g');
    }

    if (options.isDev) {
      args.push('--save-dev');
    }

    args.push(moduleName);

    return ApplicationManager.environment.run(this.binNamespace, args);
  }

  remove(moduleName) {
    return ApplicationManager.environment.run(this.binNamespace, [
      'uninstall',
      '--save',
      moduleName,
      '--silent',
    ]);
  }

  upgrade(moduleName) {
    return ApplicationManager.environment.run(this.binNamespace, [
      'update',
      moduleName,
      '--silent',
    ]);
  }
}
