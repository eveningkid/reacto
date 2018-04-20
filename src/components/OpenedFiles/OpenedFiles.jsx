import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import key from 'uniqid';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { Text } from '../_ui';
import File from '../../editor/file';
import './OpenedFiles.css';

/**
 * Display current opened files.
 */
class OpenedFiles extends React.Component {
  static propTypes = {
    openFile: PropTypes.func,
    closeFile: PropTypes.func,
    currentFile: PropTypes.instanceOf(File),
    cwd: PropTypes.string,
    openedFiles: PropTypes.instanceOf(Set),
  };

  onClickOpenedFile = filePath => this.props.openFile(filePath);

  onCloseOpenedFile = (filePath, event) => {
    event.stopPropagation();
    this.props.closeFile(filePath);
  };

  renderOpenedFile = (file, fullLengthFilename, isDuplicated, canClose) => {
    let filename = file.basename();
    const isCurrentOpenedFile =
      this.props.currentFile.filePath === file.filePath;
    const classes = classNames({
      'is-current-opened-file': isCurrentOpenedFile,
      'is-unsaved': file.hasUnsavedChanges(),
      'is-temporary': file.isTemporary(),
    });
    return (
      <li
        className={classes}
        key={key()}
        title={file.filePath}
        onClick={this.onClickOpenedFile.bind(this, file.filePath)}
      >
        <span className="path">
          {filename}
          {isDuplicated && <span>&nbsp;— {file.parentDirectory()}</span>}
        </span>

        {canClose && (
          <Icon
            className="close-opened-file"
            type="close-circle-o"
            onClick={this.onCloseOpenedFile.bind(this, fullLengthFilename)}
          />
        )}
      </li>
    );
  };

  render() {
    // TODO: refactor
    let duplicationChecker = {};

    const openedFiles = Array.from(this.props.openedFiles.values());

    const onlyFilenames = openedFiles.map(file => {
      const filePath = file.basename();

      if (!duplicationChecker.hasOwnProperty(filePath)) {
        duplicationChecker[filePath] = false;
      } else {
        duplicationChecker[filePath] = true;
      }

      return file;
    });

    return (
      <div className="OpenedFiles">
        <ul>
          {onlyFilenames.length ? (
            onlyFilenames.map((file, i) => {
              return this.renderOpenedFile(
                file,
                openedFiles[i].filePath,
                duplicationChecker[file.basename()],
                onlyFilenames.length > 1
              );
            })
          ) : (
            <li className="disabled">
              <Text light>No files open</Text>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cwd: state.project.cwd,
  openedFiles: state.project.openedFiles,
  currentFile: state.session.currentFile,
});

const mapDispatchToProps = dispatch => ({
  openFile: pathToFile => dispatch.session.openFileAsync(pathToFile),
  closeFile: pathToFile => dispatch.session.closeFileAsync(pathToFile),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenedFiles);
