import { dispatch, getState } from '@rematch/core';

const QuickTabSwitch = {
  BACKWARD: 'backward',
  FORWARD: 'forward',
};

function quickTabSwitch(type) {
  const state = getState();
  const openedFiles = Array.from(state.project.openedFiles.values());

  if (openedFiles.length === 1) {
    // We can't switch to any other file, there's only one
    return;
  }

  const currentFile = state.session.currentFile.filePath;
  let fileToFallbackTo;
  let currentFileIndex = -1;

  for (let i = 0; i < openedFiles.length; i++) {
    if (openedFiles[i].filePath === currentFile) {
      currentFileIndex = i;
    }
  }

  if (currentFileIndex === -1) {
    return;
  }

  const openedFilesLength = openedFiles.length - 1;

  switch (type) {
    default:
    case QuickTabSwitch.BACKWARD:
      const previousIndex = currentFileIndex - 1;
      let previousFile;

      if (previousIndex < 0) {
        previousFile = openedFiles[openedFilesLength];
      } else {
        previousFile = openedFiles[previousIndex];
      }

      if (previousFile) {
        fileToFallbackTo = previousFile.filePath;
      }

      break;

    case QuickTabSwitch.FORWARD:
      const nextIndex = currentFileIndex + 1;
      let nextFile;

      if (nextIndex > openedFilesLength) {
        nextFile = openedFiles[0];
      } else {
        nextFile = openedFiles[currentFileIndex + 1];
      }

      if (nextFile) {
        fileToFallbackTo = nextFile.filePath;
      }

      break;
  }

  if (fileToFallbackTo) {
    dispatch.session.openFileAsync(fileToFallbackTo);
  }
}

function quickTabSwitchForward() {
  return quickTabSwitch(QuickTabSwitch.FORWARD);
}

function quickTabSwitchBackward() {
  return quickTabSwitch(QuickTabSwitch.BACKWARD);
}

export default {
  quickTabSwitchBackward,
  quickTabSwitchForward,
};
