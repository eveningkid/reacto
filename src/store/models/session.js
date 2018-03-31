import key from 'uniqid';
import { dispatch } from '@rematch/core';
import { FileSystemManager, ParentProcessManager } from '../../editor/managers';
import availableBricks from '../../bricks';
import events from '../../editor/events';
import File from '../../editor/file';
const fs = window.require('fs');
const mkdirp = window.require('mkdirp');
const path = window.require('path');
const dialog = window.require('electron').remote.dialog;

/**
 * Not to be confused with project. Session contains more temporary data,
 * mostly related to an opened file instance.
 *
 * I believe some parts could be sent to .project instead, such as .currentFile,
 * .editor, or .allSessions to .history.
 *
 * If you have any comment about this, feel free to suggest your idea on the repo.
 * This project is a _suggestion_, and is meant to become better, with you.
 */

const emptySession = {
  bricks: [],
  code: '',
  generatedCode: '',
  originalCode: '',
  cursor: null,
  currentFileHasUnsavedChanges: false,
};

const initialState = {
  currentFile: new File(),
  editor: {},
  currentSession: { ...emptySession },
  allSessions: {},
};

export default {
  state: { ...initialState },
  reducers: {
    openFile(state, action) {
      return {
        ...state,
        currentFile: new File(action.pathToFile),
        currentSession: state.allSessions[action.pathToFile] || {
          code: action.code,
          originalCode: action.code,
          bricks: [],
          generatedCode: '',
          currentFileHasUnsavedChanges: false,
          cursor: null,
        },
        allSessions: {
          ...state.allSessions,
          [state.currentFile.filePath]: {
            ...state.currentSession,
          },
        },
      };
    },

    addBrick(state, action) {
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          bricks: [...state.currentSession.bricks, action.brick],
        },
      };
    },

    removeBrick(state, action) {
      const index = state.currentSession.bricks.findIndex(
        brick => brick.id === action.id
      );

      if (index === -1) {
        return state;
      }

      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          bricks: [
            ...state.currentSession.bricks.slice(0, index),
            ...state.currentSession.bricks.slice(index + 1),
          ],
        },
      };
    },

    renameFile(state, { filePath, newFilePath }) {
      let newState = { ...state };

      // Replace .currentFile if we're renaming it
      if (filePath === state.currentFile.filePath) {
        newState.currentFile = new File(newFilePath);
      }

      newState.allSessions[newFilePath] = {
        ...newState.allSessions[filePath],
      };

      delete newState.allSessions[filePath];

      return newState;
    },

    updateCode(state, action) {
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          code: action.code,
        },
      };
    },

    updateGeneratedCode(state, action) {
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          generatedCode: action.generatedCode,
        },
      };
    },

    updateCursor(state, action) {
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          cursor: action.cursor,
        },
      };
    },

    updateEditor(state, action) {
      return {
        ...state,
        editor: action.editor,
      };
    },

    savedFile(state) {
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          originalCode: state.currentSession.code,
          currentFileHasUnsavedChanges: false,
        },
      };
    },

    updateCurrentFileHasUnsavedChanges(state, hasUnsavedChanges) {
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          currentFileHasUnsavedChanges: hasUnsavedChanges,
        },
      };
    },

    updateSessionFromAllSessions(state, { filePath, code }) {
      return {
        ...state,
        allSessions: {
          ...state.allSessions,
          [filePath]: {
            ...state.allSessions[filePath],
            code,
          },
        },
      };
    },

    cleanCurrentSession(state) {
      return {
        ...state,
        currentSession: { ...emptySession },
      };
    },

    resetSession() {
      return { ...initialState };
    },
  },
  effects: {
    async openFileAsync(pathToFile, rootState) {
      if (pathToFile === rootState.session.currentFile.filePath) {
        return;
      }

      let isFileAlreadyOpened = false;

      for (const file of Array.from(rootState.project.openedFiles.values())) {
        if (file.filePath === pathToFile) {
          isFileAlreadyOpened = true;
        }
      }

      if (isFileAlreadyOpened) {
        this.openFile({
          pathToFile,
          code: rootState.session.allSessions[pathToFile].code,
        });
      } else {
        fs.readFile(pathToFile, 'utf-8', (err, code) => {
          if (err) return;
          this.openFile({ pathToFile, code });
          dispatch.project.openFile(pathToFile);
        });
      }

      ParentProcessManager.send(
        ParentProcessManager.actions.CURRENT_FILE_HAS_CHANGED,
        pathToFile
      );
    },

    async closeFileAsync(pathToFile, rootState) {
      const openedFiles = Array.from(rootState.project.openedFiles.values());

      if (openedFiles.length <= 1) {
        return;
      }

      const closeFile = () => {
        // Otherwise, no need to open another file,
        // simply close the given one in background
        if (rootState.session.currentFile.filePath === pathToFile) {
          let fileToFallbackTo;

          for (let i = 0; i < openedFiles.length; i++) {
            if (openedFiles[i].filePath === pathToFile) {
              if (openedFiles[i - 1]) {
                fileToFallbackTo = openedFiles[i - 1];
              } else if (openedFiles[i + 1]) {
                fileToFallbackTo = openedFiles[i + 1];
              }
            }
          }

          dispatch.project.closeFile(pathToFile);

          if (fileToFallbackTo) {
            this.openFile({ pathToFile: fileToFallbackTo.filePath });
          } else {
            this.cleanCurrentSession();
          }
        } else {
          dispatch.project.closeFile(pathToFile);
        }
      };

      let session =
        rootState.session.allSessions[pathToFile] ||
        rootState.session.currentSession;

      // Has unsaved changes
      if (session.currentFileHasUnsavedChanges) {
        const options = {
          type: 'warning',
          buttons: [`Don't Save`, 'Cancel', 'Save'],
          defaultId: 2,
          message: path.basename(pathToFile) + ' has unsaved changes',
          detail:
            'Your changes will be lost if you close this item without saving.',
        };

        dialog.showMessageBox(options, async response => {
          if (response === 0) {
            // Don't save
            closeFile();
          } else if (response === 2) {
            // Save
            // TODO if file is unsaved yet
            await events.saveFile(pathToFile);
            closeFile();
          }
        });
      } else {
        closeFile();
      }
    },

    async addBrickAsync({ brickName }) {
      brickName = brickName.toLowerCase();
      const Brick = availableBricks[brickName];

      if (Brick) {
        const brick = new Brick(key());
        this.addBrick({ brick });
      }
    },

    async renameFileAsync({ filePath, newFilePath }) {
      fs.rename(filePath, newFilePath, err => {
        if (err) return;
        dispatch.project.renameOpenedFile({ filePath, newFilePath });
        this.renameFile({ filePath, newFilePath });
      });
    },

    async createFileAsync(newFilePath) {
      const dirname = path.dirname(newFilePath);

      // Check whether the directory exists
      const directoryExists = fs.existsSync(dirname);

      if (!directoryExists) {
        mkdirp.sync(dirname);
      }

      FileSystemManager.writeEmptyFile(newFilePath).then(() =>
        this.openFileAsync(newFilePath)
      );
    },
  },
};
