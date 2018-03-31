import CodeMirror from 'codemirror';
import Snippet from './snippet';
import { autocomplete } from '../../utils';

export default class AutoComplete {
  constructor() {
    this.hinters = [];
    this.snippets = [];
  }

  addHinter(hinter) {
    this.hinters.push(hinter);
    return this;
  }

  addSnippets(snippets) {
    this.snippets.push(snippets);
    return this;
  }

  getSuggestionText(suggestion) {
    const type = typeof suggestion;

    switch (type) {
      case 'string':
        return suggestion;

      case 'object':
        return suggestion.displayText;

      default:
        return false;
    }
  }

  filterSuggestions = (input, suggestion) => {
    suggestion = this.getSuggestionText(suggestion);

    if (suggestion) {
      return suggestion.toLowerCase().includes(input.toLowerCase());
    } else {
      return false;
    }
  };

  sortSuggestions = (a, b) => {
    a = this.getSuggestionText(a).toLowerCase();
    b = this.getSuggestionText(b).toLowerCase();
    if (a < b) return -1;
    if (a > b) return 1;
    // a must be equal to b
    return 0;
  };

  suggest(editor, options) {
    const cursor = editor.getCursor();
    const token = editor.getTokenAt(cursor);
    const from = CodeMirror.Pos(cursor.line, token.start);
    const to = CodeMirror.Pos(cursor.line, token.end);

    let list = [];

    // When the current word is longer than 1 character
    // - suggest snippets
    // - filter suggestions
    if (token.string.trim().length > 1 && token.type !== 'comment') {
      // Regular suggestions
      for (const hinter of this.hinters) {
        const suggestions = hinter.getSuggestions(editor, token, options);
        list = list.concat(suggestions);
      }

      // Snippets
      const render = autocomplete.render.bind(this, 'snippet', token);
      for (const snippets of this.snippets) {
        const suggestions = snippets.map(suggestion => ({
          ...suggestion,
          hint: Snippet.hint,
          render,
        }));
        list = list.concat(suggestions);
      }

      // Filtering
      list = list.filter(this.filterSuggestions.bind(this, token.string));
    }

    if (!list.length) {
      return;
    }

    // Sort by .text
    list = list.sort(this.sortSuggestions);

    return { list, from, to };
  }
}
