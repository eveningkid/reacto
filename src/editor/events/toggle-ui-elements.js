import { dispatch } from '@rematch/core';

const ToggleUIElements = {
  BRICK_SELECTOR: 'brick_selector',
  FILE_TREE: 'file_tree',
};

function toggleUIElements(element) {
  switch (element) {
    case ToggleUIElements.BRICK_SELECTOR:
      dispatch.ui.toggleIsBrickSelectorOpened();
      break;

    case ToggleUIElements.FILE_TREE:
    default:
      dispatch.ui.toggleIsFileTreeOpened();
  }
}

function toggleUIBrickSelector() {
  return toggleUIElements(ToggleUIElements.BRICK_SELECTOR);
}

function toggleUIFileTree() {
  return toggleUIElements(ToggleUIElements.FILE_TREE);
}

export default {
  toggleUIBrickSelector,
  toggleUIFileTree,
};
