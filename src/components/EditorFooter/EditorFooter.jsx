import React from 'react';
import classNames from 'classnames';
import plural from 'plural';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import './EditorFooter.css';

/**
 * The lower part of the editor.
 * Will display information regarding current cursor's position/selection.
 * Current file's path.
 */
class EditorFooter extends React.Component {
  renderContent() {
    let hasCursor = true;
    let cursor = this.props.cursor;

    if (!cursor) {
      hasCursor = false;
      cursor = {};
    }

    const classes = classNames({
      'has-selection': cursor.selection ? true : false,
    });

    const currentFile = this.props.currentFile.filePath
      ? this.props.currentFile.filePath.replace(this.props.cwd, '').substr(1)
      : null;

    // CodeMirror cursor position starts from 0 for both (x, y)
    return (
      <span className={classes}>
        {hasCursor && (
          <React.Fragment>
            {cursor.line + 1}:{cursor.ch + 1}

            <strong>
              {cursor.selection &&
                `${cursor.selection.distance} ${plural('character', cursor.selection.distance)}`
              }
            </strong>
          </React.Fragment>
        )}

        <span className="current-opened-file" title={this.props.currentFile}>
          {currentFile}
        </span>
      </span>
    );
  }

  render() {
    const content = this.renderContent();
    return <Layout.Footer className="EditorFooter">{content}</Layout.Footer>;
  }
}

const mapStateToProps = state => ({
  currentFile: state.session.currentFile,
  cwd: state.project.cwd,
});

export default connect(mapStateToProps)(EditorFooter);
