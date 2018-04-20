import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import plural from 'plural';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import FileType from '../../editor/file';
import './EditorFooter.css';

/**
 * The lower part of the editor.
 * Will display information regarding current cursor's position/selection.
 * Current file's path.
 */
class EditorFooter extends React.Component {
  static propTypes = {
    cursor: PropTypes.object,
    currentFile: PropTypes.instanceOf(FileType),
    cwd: PropTypes.string,
  };

  renderLatestCommit = () => {
    const latestCommit = this.props.currentBranch.latestCommit;
    const author = latestCommit.author().name();
    const id = latestCommit.sha().substr(0, 7);
    const message = latestCommit.message();
    return (
      <div className="latest-commit">
        <span className="author">{author}</span>
        <span className="sha">({id})</span>
        <span className="message">{message}</span>
      </div>
    );
  };

  renderContent() {
    let hasCursor = true;
    let { currentBranch, cursor } = this.props;

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
      <div className={classes}>
        {hasCursor && (
          <React.Fragment>
            {cursor.line + 1}:{cursor.ch + 1}
            <strong>
              {cursor.selection &&
                `${cursor.selection.distance} ${plural(
                  'character',
                  cursor.selection.distance
                )}`}
            </strong>
          </React.Fragment>
        )}

        {currentBranch && (
          <div className="current-git-branch">
            <span className="branch-name">{currentBranch.name}</span>
            {this.renderLatestCommit()}
          </div>
        )}

        <div
          className="current-opened-file"
          title={this.props.currentFile.filePath}
        >
          {currentFile}
        </div>
      </div>
    );
  }

  render() {
    const content = this.renderContent();
    return <Layout.Footer className="EditorFooter">{content}</Layout.Footer>;
  }
}

const mapStateToProps = state => ({
  currentBranch: state.project.git.currentBranch,
  currentFile: state.session.currentFile,
  cwd: state.project.cwd,
});

export default connect(mapStateToProps)(EditorFooter);
