import { dispatch, getState } from '@rematch/core';
import { FileSystemManager, FormatterManager, GitManager } from '../managers';

export default function saveFile(givenFilePath = null) {
  return new Promise(async (resolve, reject) => {
    const state = getState();

    if (
      state.session &&
      state.session.editor &&
      state.session.editor.getValue &&
      state.session.currentFile
    ) {
      const filePath = givenFilePath || state.session.currentFile.filePath;
      if (!filePath) return;
      await FormatterManager.tryFormatOnSave();

      if (Object.keys(state.project.git.filesStatus).length === 0) {
        GitManager.status();
      } else {
        GitManager.status(filePath);
      }

      const content = state.session.editor.getValue();

      FileSystemManager.writeFile(filePath, content)
        .then(() => {
          // Let our store know that there is no more unsaved changed
          dispatch.session.savedFile();
          resolve();
        })
        .catch(error => reject(error));
    }
  });
}
