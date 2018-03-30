function getText(completion) {
  if (typeof completion === 'string') return completion;
  else return completion.text;
}

/**
 * This function actually brings snippet multiple selectors in Codemirror
 *
 * @param {string|object} completion
 * @param {CodeMirror.Pos} from
 * @param {CodeMirror.Pos} to
 * @return {object} { text, replacementLinesCounter, selectors }
 */
function getSnippetDetails(completion, from) {
  const variableSymbol = '#{1}';
  let content = getText(completion).replace('\t', '  ');

  const lines = content.split('\n');
  const containsSymbolIndex = lines.findIndex(line =>
    line.includes(variableSymbol)
  );
  let selectors = [];

  if (containsSymbolIndex === -1) {
    selectors.push({
      anchor: from,
      head: from,
    });
  } else {
    content = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let lineOccurencesCounter = 0;

      const newLine = line.replace(/#\{1\}/g, (match, index) => {
        const fromIndex = index - lineOccurencesCounter * 3;
        const fromLine = from.line + i;

        selectors.push({
          anchor: { line: fromLine, ch: fromIndex },
          head: { line: fromLine, ch: fromIndex },
        });

        lineOccurencesCounter++;

        return '';
      });

      content.push(newLine);
    }

    content = content.join('\n');
  }

  return { text: content, selectors, replacementLinesCounter: lines.length };
}

export default class Snippet {
  static hint = function startSnippet(editor, data, completion) {
    const from = completion.from || data.from;
    const to = completion.to || data.to;
    const { text, replacementLinesCounter, selectors } = getSnippetDetails(
      completion,
      from,
      to
    );

    editor.replaceRange(text, from, to, 'complete');
    editor.setSelections(selectors);

    for (let i = from.line; i < replacementLinesCounter + from.line; i++) {
      editor.indentLine(i);
    }
  };
}
