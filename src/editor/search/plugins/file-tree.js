import { dispatch, getState } from '@rematch/core';
import { FileTreeManager } from '../../managers';
import SearchSuggestion from '../search-suggestion';
const path = window.require('path');

// Prioritize non 'node_modules' files and opened files
function _priorityForFile(filePath, openedFiles) {
  if (filePath.includes('node_modules')) return 0;
  if (
    openedFiles.find(file => file.filePathWithoutCWD() === filePath.substr(1))
  ) {
    return 2;
  }
  return 1;
}

/**
 * Find files among current file tree.
 * @param {string} input
 * @return {Array[SearchSuggestion]}
 */
export default function fileTreePlugin(input) {
  const state = getState();
  const suggestions = [];
  input = input.toLowerCase();
  const openedFiles = Array.from(state.project.openedFiles.values());

  for (const filePath of FileTreeManager.getAllFilePaths()) {
    if (filePath.toLowerCase().includes(input)) {
      const priority = _priorityForFile(filePath, openedFiles);
      const searchSuggestion = new SearchSuggestion({
        type: 'file',
        title: path.basename(filePath),
        description: path.dirname(filePath),
        select: () => {
          const fullFilePath = path.join(state.project.cwd, filePath);
          dispatch.session.openFileAsync(fullFilePath);
        },
        priority,
      });

      suggestions.push(searchSuggestion);
    }
  }

  return suggestions;
}
