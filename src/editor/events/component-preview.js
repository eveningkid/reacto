import { dispatch, getState } from '@rematch/core';
import * as util from '../../utils';

export default function componentPreview() {
  const state = getState();

  if (state.session && state.session.currentFile.filePath) {
    const filePath = state.session.currentFile.filePath;

    if (util.file.isJavascript(filePath)) {
      if (filePath === state.project.componentPreview.filePath) {
        dispatch.project.updateComponentPreviewFilePath({ filePath: null });
      } else {
        dispatch.project.updateComponentPreviewFilePath({ filePath });
      }
    }
  }
}
