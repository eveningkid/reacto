const fs = require('fs');
const path = require('path');
const { app } = require('electron');

module.exports = {
  create: () => {
    if (process.platform === 'darwin') {
      const binaryPath = path.join(
        app.getAppPath(),
        '../../MacOS',
        app.getName()
      );
      const link = path.join('/usr/local/bin', app.getName().toLowerCase());
      fs.symlink(binaryPath, link, err => {
        if (err) {
          if (err.code === 'EEXIST') {
            console.log('Link already exists!');
          } else {
            console.log(
              'Error when trying to create symlink.',
              binaryPath,
              link,
              err
            );
          }
        } else {
          console.log('Symlink succesfully created.');
        }
      });
    } else {
      console.log('Only darwin platform symlink creation implemented.');
    }
  },
  remove: () => {
    if (process.platform === 'darwin') {
      const link = path.join('/usr/local/bin', app.getName().toLowerCase());
      fs.unlink(link, err => {
        if (err) {
          console.log('Error trying to delete symlink.', err);
        } else {
          console.log('Symlink successfuly deleted.');
        }
      });
    } else {
      console.log('Only darwin platform symlink creation implemented.');
    }
  },
};
