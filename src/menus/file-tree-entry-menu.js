import { dispatch } from '@rematch/core';
import { clipboard, shell } from 'electron';
import { PromptUserManager } from '../editor/managers';
import BaseMenu from './_base-menu';
const log = window.require('electron-log');
const path = window.require('path');
const dialog = window.require('electron').remote.dialog;

// IDEA copy code from methods to FileTreeManager
// Then call FileTreeManager directly
// e.g. FileTreeManager.renameFile(...)
//      FileTreeManager.deleteFile(...)

/**
 * Context menu for each file entry inside the file tree.
 * @param {object} options a few information about the selected file
 *                         .filePath:string, selected file path
 *                         .isDirectory:boolean
 */
function template({ filePath, isDirectory /*...options*/ }) {
  return [
    {
      label: 'New file',
      click() {
        PromptUserManager.ask(
          {
            question: 'New file',
            inputPlaceholder:
              (isDirectory ? filePath : path.dirname(filePath)) + path.sep,
          },
          newFilePath => {
            dispatch.session.createFileAsync(newFilePath);
          }
        );
      },
    },
    { type: 'separator' },
    {
      label: 'Rename',
      click() {
        const path = window.require('path');
        const filename = path.basename(filePath);
        const selection = {
          start: filePath.indexOf(filename),
          end: filePath.length,
        };

        PromptUserManager.ask(
          {
            question: 'Rename file',
            inputPlaceholder: filePath,
            selection,
          },
          newFilePath => {
            dispatch.session.renameFileAsync({ filePath, newFilePath });
          }
        );
      },
    },
    {
      label: 'Duplicate',
    },
    {
      label: 'Send to Trash',
      click() {
        const options = {
          type: 'warning',
          buttons: ['Cancel', 'Move to Trash'],
          defaultId: 1,
          message: path.basename(filePath) + ' will be moved to trash',
          detail: filePath,
        };

        dialog.showMessageBox(options, async response => {
          if (response === 1) {
            await dispatch.session.closeFileAsync(filePath);

            if (!shell.moveItemToTrash(filePath)) {
              log.info("Couldn't send", filePath, 'to trash');
            }
          }
        });
      },
    },
    {
      label: 'Copy',
      click() {
        // TODO: regarding the file type, use different methods
        // fs.readFile(filePath, fileContent = data)
        // writeText or writeImage
        // clipboard.writeText(fileContent);
      },
    },
    {
      label: 'Cut',
      click() {
        // TODO
      },
    },
    {
      label: 'Paste',
      click() {
        // TODO
      },
    },
    { type: 'separator' },
    {
      label: 'Send to Trash Directly',
      accelerator: 'Backspace',
      async click() {
        await dispatch.session.closeFileAsync(filePath);

        if (!shell.moveItemToTrash(filePath)) {
          log.info("Couldn't send", filePath, 'to trash');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Preview Component',
      click() {
        dispatch.project.updateComponentPreviewFilePath({ filePath });
      },
    },
    { type: 'separator' },
    {
      label: 'Copy Full File Path',
      click() {
        clipboard.writeText(filePath);
      },
    },
    {
      label: 'Show in Finder',
      click() {
        if (!shell.showItemInFolder(filePath)) {
          log.info("Couldn't find", filePath, 'in finder');
        }
      },
    },
  ];
}

export default new BaseMenu(template);
