import React from 'react';
import key from 'uniqid';
import { connect } from 'react-redux';
import { Tree } from '../_ui';
import { fileTreeEntryMenu } from '../../menus';
import { EventsManager, ParentProcessManager } from '../../editor/managers';

/**
 * Show the current project file tree.
 */
class FileTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileTree: {},
    };
    EventsManager.on('update-file-tree', (event, fileTree) => this.updateFileTree(fileTree));
    ParentProcessManager.send(ParentProcessManager.actions.FETCH_FILE_TREE, this.props.cwd);
  }

  updateFileTree = (fileTree) => {
    this.setState({ fileTree });
    this.props.updateFileTree(fileTree);
  }

  onSelectFile = (selectedFilePath) => {
    this.props.openFile(selectedFilePath);
  }

  renderSubTree = ([fileName, subTree], pathSoFar) => {
    const newPathSoFar = pathSoFar + '/' + fileName;
    let title = fileName;
    let isFileOpened = false;
    const isDirectory = subTree ? true : false;

    for (const openedFile of Array.from(this.props.openedFiles.values())) {
      if (openedFile.filePath === newPathSoFar) {
        isFileOpened = true;
      }
    }

    if (isFileOpened) {
      title = (<span className="is-file-opened">{fileName}</span>);
    }

    return (
      <Tree.TreeNode
        title={title}
        path={newPathSoFar}
        showIcon
        key={key()}
        onContextMenu={(event) => {
          event.stopPropagation();
          fileTreeEntryMenu.open({ filePath: newPathSoFar, isDirectory });
        }}
      >
        {subTree && Object.entries(subTree).map((file) => this.renderSubTree(file, newPathSoFar))}
      </Tree.TreeNode>
    );
  }

  render() {
    return (
      <div className="file-tree">
        <Tree onSelect={this.onSelectFile}>
          {Object
            .entries(this.state.fileTree)
            .map((file) => this.renderSubTree(file, this.props.cwd))
          }
        </Tree>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cwd: state.project.cwd,
  openedFiles: state.project.openedFiles,
});

const mapDispatchToProps = dispatch => ({
  updateFileTree: fileTree => dispatch.project.updateFileTree(fileTree),
  openFile: pathToFile => dispatch.session.openFileAsync(pathToFile),
});

export default connect(mapStateToProps, mapDispatchToProps)(FileTree);
