import { dispatch, getState } from '@rematch/core';
import { FileSystemManager } from '../managers';
const fs = window.require('fs');

export default function saveFile(givenFilePath = null) {
  return new Promise((resolve, reject) => {
    const state = getState();

    if (
      state.session
      && state.session.editor
      && state.session.editor.getValue
      && state.session.currentFile
    ) {
      const content = state.session.editor.getValue();
      const filePath = givenFilePath || state.session.currentFile.filePath;

      FileSystemManager
        .writeFile(filePath, content)
        .then(() => {
          // Let our store know that there is no more unsaved changed
          dispatch.session.savedFile();
          resolve();
        })
        .catch(error => reject(error));
    }
  });
}
