import { getState } from '@rematch/core';
import SearchSuggestion from '../search-suggestion';

/**
 * Find matches for input inside the current file
 */
export default function currentFilePlugin(input) {
  if (!input.length) {
    return;
  }

  const state = getState();
  const code = state.session.currentSession.code.split('\n');
  let regex = new RegExp(input, 'i');
  let occurences = [];

  for (let i = 0; i < code.length; i++) {
    const line = code[i];

    if (line.trim().length !== 0 && regex.test(line)) {
      // TODO Loop through each occurence found inside the current line
      const match = regex.exec(line);

      occurences.push({
        anchor: { line: i, ch: match.index },
        head: { line: i, ch: match.index + input.length },
      });
    }
  }

  if (occurences.length) {
    const suggestion = new SearchSuggestion({
      type: 'current',
      title: 'Highlight ' + occurences.length + ' occurences',
      select: () => {
        state.session.editor.setSelections(occurences);
        state.session.editor.focus();
      },
    });

    return [suggestion];
  } else {
    return [];
  }
}
