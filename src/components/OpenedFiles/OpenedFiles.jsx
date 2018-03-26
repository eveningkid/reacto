import React from 'react';
import classNames from 'classnames';
import uniqid from 'uniqid';
import { Icon } from 'antd';
import { connect } from 'react-redux';

/**
 * Display current opened files.
 */
class OpenedFiles extends React.Component {
  onClickOpenedFile = (filePath) => this.props.openFile(filePath);

  onCloseOpenedFile = (filePath, event) => {
    event.stopPropagation();
    this.props.closeFile(filePath);
  }

  renderOpenedFile = (filename, fullLengthFilename, isDuplicated, canClose) => {
    const currentFile = this.props.currentFile;

    // Another file with the same filename is opened
    if (isDuplicated) {
      const cwd = this.props.cwd;
      filename = fullLengthFilename.substr(cwd.length + 1);
    }

    const isCurrentOpenedFile = (currentFile.filePath === fullLengthFilename);

    const classes = classNames({
      'is-current-opened-file': isCurrentOpenedFile,
      'is-unsaved': currentFile.hasUnsavedChanges(),
    });

    return (
      <li
        className={classes}
        key={uniqid()}
        title={fullLengthFilename}
        onClick={this.onClickOpenedFile.bind(this, fullLengthFilename)}
      >
        {filename}

        {canClose &&
          <Icon
            className="close-opened-file"
            type="close-circle-o"
            onClick={this.onCloseOpenedFile.bind(this, fullLengthFilename)}
          />
        }
      </li>
    );
  }

  render() {
    // TODO: refactor
    let duplicationChecker = {};

    const openedFiles = Array.from(this.props.openedFiles.values());

    const onlyFilenames = openedFiles.map((file) => {
      const tillWhereShouldWeCut = file.filePath.lastIndexOf('/') + 1;
      const filePath = file.filePath.substr(tillWhereShouldWeCut);

      if (!duplicationChecker.hasOwnProperty(filePath)) {
        duplicationChecker[filePath] = false;
      } else {
        duplicationChecker[filePath] = true;
      }

      return filePath;
    });

    return (
      <div className="opened-files">
        <ul>
          {onlyFilenames.length
            ? onlyFilenames.map((filename, i) => {
              return this.renderOpenedFile(
                filename,
                openedFiles[i].filePath,
                duplicationChecker[filename],
                onlyFilenames.length > 1,
              );
            })
            : <li className="disabled">No files open</li>
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cwd: state.project.cwd,
  openedFiles: state.project.openedFiles,
  currentFile: state.session.currentFile,
});

const mapDispatchToProps = (dispatch) => ({
  openFile: (pathToFile) => dispatch.session.openFileAsync(pathToFile),
  closeFile: (pathToFile) => dispatch.session.closeFileAsync(pathToFile),
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenedFiles);
