import Hint from '../hint';

export default class GeneralHint extends Hint {
  getSuggestions(/*editor, token, options*/) {
    let found = new Set();

    // TODO for now, it is not helping at all
    // const firstLine = editor.firstLine();
    // const lastLine = editor.lastLine();
    //
    // for (let i = firstLine; i <= lastLine; i++) {
    //   const line = editor.getLine(i);
    //
    //   line
    //     .split(' ')
    //     .filter(word => word.trim().length)
    //     // .forEach(word => found.add(word));
    // }

    return Array.from(found);
  }
}

/**
 * Original source from `codemirror/addon/hint/anyword-hint.js`
 */
// var WORD = /[\w$]+/, RANGE = 500;
// CodeMirror.registerHelper("hint", "anyword", function(editor, options) {
//   var word = options && options.word || WORD;
//   var range = options && options.range || RANGE;
//   var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
//   var end = cur.ch, start = end;
//   while (start && word.test(curLine.charAt(start - 1))) --start;
//   var curWord = start != end && curLine.slice(start, end);
//
//   var list = options && options.list || [], seen = {};
//   var re = new RegExp(word.source, "g");
//   for (var dir = -1; dir <= 1; dir += 2) {
//     var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
//     for (; line != endLine; line += dir) {
//       var text = editor.getLine(line), m;
//       while (m = re.exec(text)) {
//         if (line == cur.line && m[0] === curWord) continue;
//         if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
//           seen[m[0]] = true;
//           list.push(m[0]);
//         }
//       }
//     }
//   }
//   return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
// });
