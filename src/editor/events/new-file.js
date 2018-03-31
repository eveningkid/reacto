import { dispatch, getState } from '@rematch/core';
import { PromptUserManager } from '../managers';
const path = window.require('path');

export default function newFile() {
  const state = getState();
  const currentSessionFilePath = state.session.currentFile.filePath;
  let filePath = state.project.cwd;

  if (currentSessionFilePath) {
    filePath = path.dirname(currentSessionFilePath);
  }

  PromptUserManager.ask(
    {
      question: 'New file',
      inputPlaceholder: filePath + path.sep,
    },
    newFilePath => {
      dispatch.session.createFileAsync(newFilePath);
    }
  );
}
