const path = window.require('path');

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

    for (const [fileName, children] of subtree) {
      if (children) {
        this._throughFileTree(children, path.join(pathSoFar, fileName));
      }
      const to = path.join(pathSoFar, fileName);
      this.allFilePaths.push(to);
    }
  };

  static _instance() {
    if (!this.instance) {
      this.instance = new FileTreeManager();
    }
    return this.instance;
  }

  static updateFileTree(fileTree) {
    const manager = this._instance();
    manager.fileTree = fileTree;
    manager._parseFileTree();
  }

  static getAllFilePaths() {
    return this._instance().allFilePaths;
  }

  static find(pattern) {
    const files = this.getAllFilePaths();
    const found = [];

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
    const found = this.find(pattern);
    if (found.length > 0) {
      return found[0];
    }
    return null;
  }
}

export default FileTreeManager;
