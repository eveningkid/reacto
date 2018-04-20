import { dispatch, getState } from '@rematch/core';
import { ApplicationManager, FileTreeManager } from '.';
const Git = window.require('nodegit');

class GitManager {
  static instance;

  constructor() {
    this.repository = null;
    this.taskQueue = [];
  }

  static _instance() {
    if (!this.instance) this.instance = new GitManager();
    return this.instance;
  }

  static start(cwd) {
    Git.Repository.open(cwd).then(repository => {
      this._instance().repository = repository;
      dispatch.project.updateGitRepository(repository);
    });
  }

  static refresh(cwd) {
    this.start(cwd);
  }

  static updateCurrentBranchName() {
    return new Promise((resolve, reject) => {
      this._instance()
        .repository.getCurrentBranch()
        .then(reference => {
          const referenceName = reference.name();
          const branchName = referenceName.substr(
            referenceName.lastIndexOf('/') + 1
          );
          resolve(branchName);
        })
        .catch(error => reject(error));
    });
  }

  static updateCurrentBranchLatestCommit(branchName) {
    return new Promise((resolve, reject) => {
      this._instance()
        .repository.getBranchCommit(branchName)
        .then(commit => resolve(commit))
        .catch(error => reject(error));
    });
  }

  static updateCurrentBranch() {
    return new Promise(async (resolve, reject) => {
      try {
        const name = await this.updateCurrentBranchName();
        const latestCommit = await this.updateCurrentBranchLatestCommit(name);
        const branch = { name, latestCommit };
        dispatch.project.updateGitCurrentBranch(branch);
      } catch (error) {
        reject(error);
      }
    });
  }

  static _checkForIgnored(filesStatus) {
    return new Promise(resolve => {
      const allPaths = FileTreeManager.getAllFilePaths();
      const isIgnoredPromises = [];
      for (const currentPath of allPaths) {
        isIgnoredPromises.push(
          Git.Ignore.pathIsIgnored(this._instance().repository, currentPath)
        );
      }
      Promise.all(isIgnoredPromises).then(results => {
        results.forEach((result, index) => {
          if (result === 1) {
            const finalPath = allPaths[index].substr(1);
            filesStatus[finalPath] = 'ignored';
          }
        });
        resolve(filesStatus);
      });
    });
  }

  // Checking if it's useful to dispatch an update
  static _dispatchNewStatus(filesStatus) {
    const currentFileStatus = getState().project.git.filesStatus;
    for (const [path, status] of Object.entries(filesStatus)) {
      if (currentFileStatus[path] && currentFileStatus[path] === status) {
        delete filesStatus[path];
      }
    }
    if (Object.keys(filesStatus).length > 0) {
      dispatch.project.updateGitFilesStatus(filesStatus);
    }
  }

  static _statusToName(status) {
    let statusName;
    switch (status) {
      case 0:
        statusName = 'regular';
        break;

      case Git.Status.STATUS.WT_NEW:
        statusName = 'new';
        break;

      case Git.Status.STATUS.WT_MODIFIED:
      case Git.Status.STATUS.WT_RENAMED:
        statusName = 'modified';
        break;

      case Git.Status.STATUS.IGNORED:
        statusName = 'ignored';
        break;

      default: // Nothing
    }
    return statusName;
  }

  static status(path) {
    if (!this._instance().repository) {
      console.log('No repo');
      return;
    }

    // Require only status for a given file
    if (path) {
      path = path.replace(ApplicationManager.environment.getCWD() + '/', '');
      Git.Status.file(this._instance().repository, path).then(status => {
        const statusName = this._statusToName(status);
        if (statusName) {
          const finalFilesStatus = {
            [path]: statusName,
          };
          this._dispatchNewStatus(finalFilesStatus);
        }
      });
    } else {
      this.updateCurrentBranch();

      const filesStatus = {};
      Git.Status.foreach(this._instance().repository, (path, status) => {
        const statusName = this._statusToName(status);
        if (statusName) {
          filesStatus[path] = statusName;
        }
      })
        .then(() => this._checkForIgnored(filesStatus))
        .then(finalFilesStatus => {
          this._dispatchNewStatus(finalFilesStatus);
        });
    }
  }
}

export default GitManager;
