import { getState } from '@rematch/core';
import { autocomplete, hint } from '../../../utils';
import { FileTreeManager } from '../../../editor/managers';
import * as util from '../../../utils';
import Hint from '../hint';
import Suggestion from '../suggestion';

const path = window.require('path');
const HISTORY_MAX_LENGTH = 3;

export default class JavascriptHint extends Hint {
  constructor() {
    super();
    this.history = new hint.History(HISTORY_MAX_LENGTH);
  }

  getLocalSuggestions = () => {
    const state = getState();
    const currentFilePath = state.session.currentFile.filePath;
    const from = currentFilePath.replace(state.project.cwd, '');
    let approvedSuggestions = [];

    for (const to of FileTreeManager.getAllFilePaths()) {
      if (from && from !== to) {
        let toFile = path.relative(from, to).substr(2);

        if (toFile.substr(0, 3) !== '/..') {
          toFile = '.' + toFile;
        } else {
          toFile = toFile.substr(1);
        }

        if (util.file.isJavascript(to)) {
          toFile = toFile.substr(0, toFile.lastIndexOf('.'));
        }

        const suggestion = new Suggestion({
          text: `'${toFile}';`,
          displayText: path.basename(to),
          metadata: path.dirname(to),
        });

        approvedSuggestions.push(suggestion);
      }
    }

    return approvedSuggestions;
  }

  getSuggestions(editor, token, options) {
    // Only whitespaces
    const offset = (token.string.trim().length === 0) ? token.string.length : 0;

    let found = [];

    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);

    if (hint.isImport(line)) {
      const state = getState();

      if (state.project.packageManager) {
        const dependencies = state.project.packageManager.allDependencies;

        if (!dependencies) {
          return;
        }

        for (const [dependency] of Object.values(dependencies)) {
          const suggestion = new Suggestion({
            text: `${' '.repeat(offset)}'${dependency}';`,
            displayText: dependency,
            render: autocomplete.render.bind(this, 'module', token),
          });

          found.push(suggestion);
        }
      }

      const localSuggestions = this.getLocalSuggestions().map((suggestion) => {
        suggestion.text = ' '.repeat(offset) + suggestion.text;
        suggestion.render = autocomplete.render.bind(this, 'local', token);
        return suggestion;
      });

      found = found.concat(localSuggestions);
    }

    return found;
  }
}
