import React from 'react';
import PropTypes from 'prop-types';
import key from 'uniqid';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Tree } from '../_ui';
import { fileTreeEntryMenu } from '../../menus';
import {
  EventsManager,
  GitManager,
  ParentProcessManager,
} from '../../editor/managers';
import config from '../../config';
import './FileTree.css';

/**
 * Show the current project file tree.
 */
class FileTree extends React.Component {
  static propTypes = {
    cwd: PropTypes.string,
    openFile: PropTypes.func,
    updateFileTree: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      fileTree: {},
    };
  }

  componentDidMount() {
    if (this.props.cwd) GitManager.start(this.props.cwd);
    EventsManager.on('update-file-tree', (event, fileTree) =>
      this.updateFileTree(fileTree)
    );
    ParentProcessManager.send(
      ParentProcessManager.actions.FETCH_FILE_TREE,
      this.props.cwd
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.cwd !== prevProps.cwd) {
      GitManager.refresh(this.props.cwd);
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.isFileTreeOpened || nextProps.isFileTreeOpened;
  }

  updateFileTree = fileTree => {
    this.setState({ fileTree });
    this.props.updateFileTree(fileTree);
  };

  onSelectFile = (selectedFilePath, isDoubleClick) => {
    this.props.openFile(selectedFilePath);

    if (isDoubleClick) {
      this.props.keepTemporaryFile(selectedFilePath);
    }
  };

  renderSubTree = ([fileName, subTree], pathSoFar) => {
    const newPathSoFar = pathSoFar + '/' + fileName;
    let title = fileName;
    const isDirectory = subTree ? true : false;
    const isDotFile = fileName.startsWith('.');
    const shortenPath = newPathSoFar.replace(this.props.cwd, '').substr(1);
    const fileGitStatus = this.props.filesStatus[shortenPath];
    const classes = classNames({
      'secondary-file': isDotFile,
      'git-status-modified': fileGitStatus && fileGitStatus === 'modified',
      'git-status-new': fileGitStatus && fileGitStatus === 'new',
      'git-status-ignored': fileGitStatus && fileGitStatus === 'ignored',
    });
    return (
      <Tree.TreeNode
        title={title}
        path={newPathSoFar}
        key={key()}
        onContextMenu={event => {
          event.stopPropagation();
          fileTreeEntryMenu.open({ filePath: newPathSoFar, isDirectory });
        }}
        className={classes}
      >
        {subTree &&
          Object.entries(subTree).map(file =>
            this.renderSubTree(file, newPathSoFar)
          )}
      </Tree.TreeNode>
    );
  };

  render() {
    let files = Object.entries(this.state.fileTree);

    if (config().fileTree.hideNodeModules) {
      files = files.filter(([fileName]) => fileName !== 'node_modules');
    }

    return (
      <div className="FileTree">
        <Tree onSelect={this.onSelectFile}>
          {files.map(file => this.renderSubTree(file, this.props.cwd))}
        </Tree>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cwd: state.project.cwd,
  filesStatus: state.project.git.filesStatus,
  isFileTreeOpened: state.ui.isFileTreeOpened,
});

const mapDispatchToProps = dispatch => ({
  updateFileTree: fileTree => dispatch.project.updateFileTree(fileTree),
  openFile: pathToFile => dispatch.session.openFileAsync(pathToFile),
  keepTemporaryFile: pathToFile =>
    dispatch.project.keepTemporaryFile(pathToFile),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileTree);
