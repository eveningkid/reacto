const fs = window.require('fs');

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
}

export default FileSystemManager;
