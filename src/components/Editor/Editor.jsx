import React from 'react';
import keycodes from 'keycodes';
import { connect } from 'react-redux';
import { JSHINT } from 'jshint';
import { getState } from '@rematch/core';
import { Controlled as CodeMirrorEditor } from 'react-codemirror2';
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/display/rulers';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/css/css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/display/placeholder';
import 'codemirror/keymap/sublime';
import 'codemirror/keymap/vim';
import '../../editor/hint';
import config from '../../config';
import placeholders from '../../editor/placeholders';
import { j, hint, file } from '../../utils';

window.JSHINT = JSHINT;

/**
 * Code editor.
 */
class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      options: {
        lineNumbers: true,
        theme: 'night-flight',
        tabSize: 2,
        tabMode: 'indentAuto',
        mode: 'jsx',
        lint: {
          getAnnotations: this.getAnnotations,
          async: true,
          callback: this.linter,
        },
        gutters: ['CodeMirror-lint-markers'],
        extraKeys: {
          'Cmd-Alt-B': 'autocomplete',
          // TODO find out why it isn't working on macOS
          'Cmd-Alt-C': 'toggleComment',
        },
        placeholder: placeholders.getRandom(),
        keyMap: this.keyMap(),
        viewportMargin: 100,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchBrackets: true,
        matchTags: true,
        highlightSelectionMatches: true,
        continueComments: true,
        styleActiveLine: true,
      },
    };
  }

  componentWillMount() {
    this.setState({ code: getState().session.currentSession.code });
  }

  componentWillReceiveProps(nextProps) {
    const nextGeneratedCode = nextProps.generatedCode;

    if (
      nextGeneratedCode &&
      nextGeneratedCode !== this.props.generatedCode &&
      nextGeneratedCode !== this.state.code
    ) {
      // Allow optional undo/redo operations for the editor
      this.props.editor.operation(() => {
        this.props.editor.setValue(nextGeneratedCode);
      });

      this.setState({ code: nextGeneratedCode }, () => {
        this.props.updateCode(nextGeneratedCode);
        this.parseCode();
      });
    }

    const currentFile = this.props.currentFile.filePath;
    const nextFile = nextProps.currentFile.filePath;

    const currentBricks = this.props.bricks;
    const nextBricks = nextProps.bricks;

    const didFileChange = currentFile !== nextFile;

    if (nextBricks.length > currentBricks.length) {
      this.parseCode(nextBricks);
    }

    if (didFileChange) {
      const code = nextProps.code;
      const language = file.whichLanguage(nextFile);
      let options = this.state.options;
      options.mode = language;

      this.setState({ code, options }, () => {
        this.parseCode();
        nextProps.editor.focus();
      });
    }
  }

  getAnnotations = (value, updateLinting, options) => {
    if (!value.trim().length) {
      return updateLinting([]);
    }

    options.callback(value, errors => updateLinting(errors));
  };

  /**
   * Gets the current keyMap of the editor.
   */
  keyMap = () => (config()._get('editor.vim') ? 'vim' : 'sublime');

  /**
   * TODO
   * Called for linting
   */
  linter = (code, resolver) => {
    // if (this.props.linter && this.props.linter.lint) {
    //   if (this.willLintTimeout) {
    //     clearTimeout(this.willLintTimeout);
    //   }
    //
    //   this.willLintTimeout = setTimeout(() => {
    //     this.props.linter.lint(ApplicationManager, resolver);
    //   }, 3000);
    // }
  };

  editorDidMount = editor => {
    this.props.updateEditor(editor);
  };

  /**
   * Triggered when editor is focused/unfocused.
   */
  onFocus = focused => {
    const { options } = this.state;

    this.setState({ options: { ...options, keyMap: this.keyMap() } });
  };

  /**
   * Update cursor position, cursor selection.
   */
  onCursor = (editor, cursorPosition) => {
    let cursor = cursorPosition;
    const selection = editor.getDoc().getSelection();

    this.setState({ keyMap: this.keyMap() });

    if (selection.length > 0) {
      const from = editor.getCursor(true);
      const to = editor.getCursor(false);
      const distance = selection.length;
      cursor.selection = { from, to, distance };
    }

    this.props.updateCursor(cursor);
  };

  /**
   * Triggered whenever a key's up.
   */
  onKeyUp = (editor, event) => {
    const keycode = keycodes(event.keyCode);

    if (!['windows', 'ctrl'].includes(keycode)) {
      if (this.timeoutCodeToProps) {
        clearTimeout(this.timeoutCodeToProps);
      }

      this.timeoutCodeToProps = setTimeout(() => {
        this.props.updateCode(this.state.code);
      }, 750);
    }

    if (this.countdownToParsing) {
      clearTimeout(this.countdownToParsing);
    }

    this.countdownToParsing = setTimeout(() => this.parseCode(), 1500);

    if (!editor.state.completionActive && !hint.isExcludedKey(event)) {
      CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    }
  };

  /**
   * Triggered whenever code has changed.
   */
  updateCode = (editor, data, value) => {
    this.setState({ code: value });
  };

  /**
   * Called to update all the current bricks's information.
   * @param {Array} currentBricks
   */
  parseCode = currentBricks => {
    // If there is no brick attached to the current file,
    // or if the language can't be parsed, skip the parsing.
    if (
      (!currentBricks && !this.props.bricks.length) ||
      !file.isJavascript(this.props.currentFile.filePath)
    ) {
      return;
    }

    try {
      const code = this.state.code;
      const parsed = j(code);
      const bricks = currentBricks || this.props.bricks;
      const state = getState();
      bricks.forEach(brick => brick.prepareToEvaluate(code, parsed, state));
    } catch (error) {
      console.warn("[Parser] Couldn't parse code");
      console.log(error);
    }
  };

  render() {
    return (
      <CodeMirrorEditor
        value={this.state.code}
        options={this.state.options}
        editorDidMount={this.editorDidMount}
        onBeforeChange={this.updateCode}
        onCursor={this.onCursor}
        onFocus={this.onFocus}
        autoFocus={true}
        onKeyUp={this.onKeyUp}
        placeholder="Salut tout le monde"
      />
    );
  }
}

const mapStateToProps = state => ({
  editor: state.session.editor,
  linter: state.project.linter,
  code: state.session.currentSession.code,
  generatedCode: state.session.currentSession.generatedCode,
  currentFile: state.session.currentFile,
  bricks: state.session.currentSession.bricks,
});

const mapDispatchToProps = dispatch => ({
  updateCode: code => dispatch.session.updateCode({ code }),
  updateEditor: editor => dispatch.session.updateEditor({ editor }),
  updateCursor: cursorPosition =>
    dispatch.session.updateCursor({ cursor: cursorPosition }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
