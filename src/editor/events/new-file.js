import { dispatch, getState } from '@rematch/core';
import { PromptUserManager } from '../managers';
const path = window.require('path');

export default function newFile() {
  const state = getState();
  const currentSessionFilePath = state.session.currentFile.filePathWithoutCWD();
  const filePath = currentSessionFilePath
    ? path.dirname(currentSessionFilePath)
    : currentSessionFilePath;

  PromptUserManager.ask(
    {
      question: 'New file',
      inputPlaceholder: filePath + path.sep,
    },
    newFilePath => {
      const fullNewFilePath = path.join(state.project.cwd, newFilePath);
      console.log(fullNewFilePath);
      dispatch.session.createFileAsync(fullNewFilePath);
    }
  );
}
