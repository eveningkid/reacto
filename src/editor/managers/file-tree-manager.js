import { EventsManager } from '.';
const path = window.require('path');

EventsManager.on('update-file-tree', (event, fileTree) => {
  FileTreeManager.updateFileTree(fileTree);
});

class FileTreeManager {
  static instance;

  constructor() {
    this.fileTree = {};
    this.allFilePaths = [];
  }

  _parseFileTree = () => {
    this.allFilePaths = [];
    this._throughFileTree(this.fileTree, '/');
  };

  _throughFileTree = (subtree, pathSoFar) => {
    subtree = Object.entries(subtree);

    for (const [filename, children] of subtree) {
      if (children) {
        this._throughFileTree(children, path.join(pathSoFar, filename));
      } else {
        const to = path.join(pathSoFar, filename);
        this.allFilePaths.push(to);
      }
    }
  };

  static _instance() {
    if (!FileTreeManager.instance) {
      FileTreeManager.instance = new FileTreeManager();
    }

    return FileTreeManager.instance;
  }

  static updateFileTree(fileTree) {
    const manager = FileTreeManager._instance();
    manager.fileTree = fileTree;
    manager._parseFileTree();
  }

  static getAllFilePaths() {
    return FileTreeManager._instance().allFilePaths;
  }

  static find(pattern) {
    const files = FileTreeManager._instance().allFilePaths;
    let found = [];

    if (pattern instanceof RegExp) {
      for (const file of files) {
        if (pattern.exec(file)) {
          found.push(file);
        }
      }
    } else {
      for (const file of files) {
        if (file.includes(pattern)) {
          found.push(file);
        }
      }
    }

    return found;
  }

  static findOne(pattern) {
    const found = FileTreeManager.find(pattern);
    if (found.length > 0) {
      return found[0];
    }
    return null;
  }
}

export default FileTreeManager;
