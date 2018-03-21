import React from 'react';
import { connect } from 'react-redux';
import { JSHINT } from 'jshint';
import { getState } from '@rematch/core';
import CodeMirror from 'codemirror';
import { Controlled as CodeMirrorEditor } from 'react-codemirror2';
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
import { EditorFooter } from '..';
import placeholders from '../../editor/placeholders';
import { j, hint, file, perf } from '../../utils';

window.JSHINT = JSHINT;

/**
 * Code editor.
 */
class Editor extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      cursor: null,
      options: {
        lineNumbers: true,
        theme: 'night-flight',
        tabSize: 2,
        tabMode: 'indentAuto',
        mode: 'jsx',
        keyMap: this.keyMap(),
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
  keyMap = () => (config().editor.vim ? 'vim' : 'sublime');

  /**
   * TODO
   * Called for linting
   */
  linter = (code, resolver) => {
    // if (this.props.linter && this.props.linter.lint) {
    //   perf.debounce(this.props.linter.lint.bind(this, ApplicationManager, resolver), 3000);
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
  onCursor = (editor) => {
    const selection = editor.getDoc().getSelection();

    if (selection.length > 0) {
      const cursor = editor.getCursor();
      const from = editor.getCursor(true);
      const to = editor.getCursor(false);
      const distance = selection.length;
      cursor.selection = { from, to, distance };
      this.setState({ cursor });
    }
  };

  /**
   * Triggered whenever a key's up.
   */
  onKeyUp = (editor, event) => {
    if (!editor.state.completionActive && !hint.isExcludedKey(event)) {
      CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    }
  };

  /**
   * Triggered whenever code has changed.
   */
  updateCode = (editor, data, value) => {
    this.setState({ code: value, cursor: editor.getCursor() }, () => {
      perf.debounce(this.props.updateCode.bind(this, value), 1000);
      perf.debounce(this.parseCode, 1500);
    });
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
      <React.Fragment>
        <CodeMirrorEditor
          value={this.state.code}
          options={this.state.options}
          editorDidMount={this.editorDidMount}
          onBeforeChange={this.updateCode}
          onFocus={this.onFocus}
          onCursorActivity={this.onCursor}
          autoFocus={true}
          onKeyUp={this.onKeyUp}
        />

        <EditorFooter cursor={this.state.cursor} />
      </React.Fragment>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
