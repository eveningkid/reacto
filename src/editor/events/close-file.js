import { dispatch, getState } from '@rematch/core';

export default function closeFile() {
  const state = getState();

  if (state.session && state.session.currentFile) {
    const pathToFile = state.session.currentFile.filePath;
    dispatch.session.closeFileAsync(pathToFile);
  }
}
