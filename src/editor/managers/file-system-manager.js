const fs = window.require('fs');
const mkdirp = window.require('mkdirp');

class FileSystemManager {
  static writeFile(filePath, content, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, encoding, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static writeEmptyFile(filePath) {
    return FileSystemManager.writeFile(filePath, '');
  }

  static createFolderIfNotExists(folderPath) {
    // Check whether the directory exists
    const directoryExists = fs.existsSync(folderPath);
    if (!directoryExists) {
      mkdirp.sync(folderPath);
    }
  }
}

export default FileSystemManager;
