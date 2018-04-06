import { dispatch } from '@rematch/core';
import { FlowLinter } from '../../tools/linters';
import File from '../../editor/file';
const parentProcess = window.require('process');

/**
 * Project contains anything related to the current opened project.
 * Meaning we save the current CWD, the file tree, which files are opened,
 * which tools are we using (package manager, compiler, component preview, ...).
 */

const initialState = {
  cwd: '',
  fileTree: {},
  openedFiles: new Set(),
  linter: new FlowLinter(),
  packageManager: null,
  taskRunner: null,
  compiler: 'babel',
  componentPreview: {
    filePath: '',
  },
};

export default {
  state: { ...initialState },
  reducers: {
    updateCwd(state, cwd) {
      if (cwd) parentProcess.chdir(cwd);
      return { ...state, cwd };
    },

    openFile(state, pathToFile) {
      const file = new File(pathToFile);
      return {
        ...state,
        openedFiles: new Set([...state.openedFiles, file]),
      };
    },

    openTemporaryFile(state, pathToFile) {
      const temporaryFile = new File(pathToFile);
      temporaryFile.setIsTemporary();
      return {
        ...state,
        openedFiles: new Set([...state.openedFiles, temporaryFile]),
      };
    },

    // Set the current temporary file as not temporary anymore
    keepTemporaryFile(state, pathToFile) {
      let file;

      for (const openedFile of Array.from(state.openedFiles.values())) {
        if (openedFile.filePath === pathToFile) {
          file = openedFile;
        }
      }

      if (!file || !file.isTemporary()) return state;
      else file.setIsNotTemporary();

      return {
        ...state,
        openedFiles: new Set([...state.openedFiles]),
      };
    },

    closeFile(state, pathToFile) {
      let file;

      for (const openedFile of Array.from(state.openedFiles.values())) {
        if (openedFile.filePath === pathToFile) {
          file = openedFile;
        }
      }

      if (!file) return state;
      else state.openedFiles.delete(file);

      return {
        ...state,
        openedFiles: new Set([...state.openedFiles]),
      };
    },

    renameOpenedFile(state, { filePath, newFilePath }) {
      let openedFiles = Array.from(state.openedFiles.values());

      for (let i = 0; i < openedFiles.length; i++) {
        const file = openedFiles[i];

        if (file.filePath === filePath) {
          openedFiles[i] = new File(newFilePath);
        }
      }

      return {
        ...state,
        openedFiles: new Set([...openedFiles]),
      };
    },

    updatePackageManager(state, action) {
      return {
        ...state,
        packageManager: action.packageManager,
      };
    },

    updateTaskRunner(state, action) {
      return {
        ...state,
        taskRunner: action.taskRunner,
      };
    },

    updateCompiler(state, action) {
      return {
        ...state,
        compiler: action.compiler,
      };
    },

    updateComponentPreviewFilePath(state, action) {
      return {
        ...state,
        componentPreview: {
          ...state.componentPreview,
          filePath: action.filePath,
        },
      };
    },

    updateFileTree(state, fileTree) {
      return { ...state, fileTree };
    },

    resetProject() {
      return { ...initialState };
    },
  },
  effects: {
    switchProject(cwd, rootState) {
      // If current .cwd
      const currentCwd = rootState.project.cwd;
      if (currentCwd) {
        // Reset both session and project
        dispatch.session.resetSession();
        dispatch.project.resetProject();
      }

      // Change local .cwd
      this.updateCwd(cwd);

      // Add or update history's recent project
      dispatch.history.addOrUpdateRecentProject(cwd);
    },
  },
};
