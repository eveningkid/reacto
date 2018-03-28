import { dispatch, getState } from '@rematch/core';

function quickFileSwitch(number) {
  const state = getState();
  const openedFiles = Array.from(state.project.openedFiles.values());
  const currentFile = state.session.currentFile.filePath;

  if (openedFiles.length <= 1) return;

  let fileToOpen;
  if (number === 9) {
    // Opening the last file in the list
    fileToOpen = openedFiles.slice(-1)[0];
  } else if (openedFiles[number - 1]) {
     // Number goes from 1~8, array from 0~7
    fileToOpen = openedFiles[number - 1];
  }

  if (!fileToOpen || currentFile === fileToOpen) return;
  dispatch.session.openFileAsync(fileToOpen.filePath);
}

export default quickFileSwitch;
