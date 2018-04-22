import { default as newFile } from './new-file';
import { default as closeFile } from './close-file';
import { default as quickTabSwitch } from './quick-tab-switch';
import { default as saveFile } from './save-file';
import { default as search } from './search';
import { default as switchPackageManager } from './switch-package-manager';
import { default as componentPreview } from './component-preview';
import { default as formatCurrentFile } from './format-current-file';
import { default as toggleUIElements } from './toggle-ui-elements';
import { default as quickFileSwitch } from './quick-file-switch';
import { EventsManager, FileTreeManager, GitManager } from '../managers';

const events = {
  newFile,
  closeFile,
  componentPreview,
  formatCurrentFile,
  quickFileSwitch,
  quickTabSwitchBackward: quickTabSwitch.quickTabSwitchBackward,
  quickTabSwitchForward: quickTabSwitch.quickTabSwitchForward,
  saveFile,
  search,
  switchPackageManagerToNpm: switchPackageManager.switchPackageManagerToNpm,
  switchPackageManagerToYarn: switchPackageManager.switchPackageManagerToYarn,
  toggleUIBrickSelector: toggleUIElements.toggleUIBrickSelector,
  toggleUIFileTree: toggleUIElements.toggleUIFileTree,
};

EventsManager.on('new-file', events.newFile)
  .on('close-file', events.closeFile)
  .on('save-file', () => events.saveFile())
  .on('search', events.search)
  .on('quick-switch-tab-backward', events.quickTabSwitchBackward)
  .on('quick-switch-tab-forward', events.quickTabSwitchForward)
  .on('switch-package-manager-to-npm', events.switchPackageManagerToNpm)
  .on('switch-package-manager-to-yarn', events.switchPackageManagerToYarn)
  .on('component-preview', events.componentPreview)
  .on('format-current-file', events.formatCurrentFile)
  .on('toggle-ui-file-tree', events.toggleUIFileTree)
  .on('toggle-ui-brick-selector', events.toggleUIBrickSelector)
  .on('update-file-tree', (event, fileTree) => {
    FileTreeManager.updateFileTree(fileTree);
    GitManager.status();
  });

for (const number of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  EventsManager.on(`quick-file-switch-${number}`, () => {
    events.quickFileSwitch(number);
  });
}

export default events;
