import { dispatch, getState } from '@rematch/core';
import { FileTreeManager } from '../../managers';
import SearchSuggestion from '../search-suggestion';
const path = window.require('path');

export default function fileTreePlugin(input) {
  const state = getState();
  let suggestions = [];
  input = input.toLowerCase();

  for (const filePath of FileTreeManager.getAllFilePaths()) {
    if (filePath.toLowerCase().includes(input)) {
      const searchSuggestion = new SearchSuggestion({
        type: 'file',
        title: path.basename(filePath),
        description: path.dirname(filePath),
        select: () => {
          const fullFilePath = path.join(state.project.cwd, filePath);
          dispatch.session.openFileAsync(fullFilePath);
        },
      });

      suggestions.push(searchSuggestion);
    }
  }

  return suggestions;
}
