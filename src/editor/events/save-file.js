import { dispatch, getState } from '@rematch/core';
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

      fs.writeFile(filePath, content, 'utf8', () => {
        // Let our store know that there is no more unsaved changed
        dispatch.session.savedFile();
        resolve();
      });
    }
  });
}
