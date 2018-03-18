import { dispatch, getState } from '@rematch/core';
import * as packageManagers from '../../tools/package-managers';

const SwitchPackageManager = {
  NPM: 'npm',
  YARN: 'yarn',
};

function switchPackageManager(type) {
  const currentPackageManager = getState().project.packageManager;
  let packageManager;

  switch (type) {
    default:
    case SwitchPackageManager.NPM:
      if (typeof currentPackageManager !== packageManagers.NpmPackageManager) {
        packageManager = new packageManagers.NpmPackageManager();
      }
      break;

    case SwitchPackageManager.YARN:
      if (typeof currentPackageManager !== packageManagers.YarnPackageManager) {
        packageManager = new packageManagers.YarnPackageManager();
      }
      break;
  }

  if (packageManager) {
    dispatch.project.updatePackageManager({ packageManager });
  }
}

function switchPackageManagerToNpm() {
  return switchPackageManager(SwitchPackageManager.NPM);
}

function switchPackageManagerToYarn() {
  return switchPackageManager(SwitchPackageManager.YARN);
}

export default {
  switchPackageManagerToNpm,
  switchPackageManagerToYarn,
};
