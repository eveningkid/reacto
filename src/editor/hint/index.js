import CodeMirror from 'codemirror';
import AutoComplete from './autocomplete';
import GeneralHint from './modes/general';
import JavascriptHint from './modes/javascript';
import ReactHint from './modes/react';
import reactSnippets from './snippets/react';
import javascriptSnippets from './snippets/javascript';

const hinter = new AutoComplete();
const generalHint = new GeneralHint();
const javascriptHint = new JavascriptHint();
const reactHint = new ReactHint();

hinter
  .addHinter(generalHint)
  .addHinter(javascriptHint)
  .addHinter(reactHint)
  .addSnippets(javascriptSnippets)
  .addSnippets(reactSnippets);

CodeMirror.registerHelper(
  'hint',
  'anyword', // Could be any "mode" e.g. "javascript"
  (editor, options) => hinter.suggest(editor, options)
);

export default hinter;
