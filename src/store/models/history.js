/**
 * History aims to remember anything that needs to be remembered.
 * So far it only remembers the most recently opened projects.
 *
 * This is currently the only part of the redux store that is saved to
 * local disk.
 */

const initialState = {
  recentProjects: [],
};

export default {
  state: { ...initialState },
  reducers: {
    addRecentProject(state, cwd) {
      return {
        ...state,
        recentProjects: [cwd, ...state.recentProjects],
      };
    },

    updateRecentProject(state, cwd) {
      const others = [...state.recentProjects.filter(_cwd => _cwd !== cwd)];

      return {
        ...state,
        recentProjects: [cwd, ...others],
      };
    },
  },
  effects: {
    addOrUpdateRecentProject(cwd, rootState) {
      if (!cwd) return;
      const index = rootState.history.recentProjects.findIndex(
        _cwd => _cwd === cwd
      );

      if (index === -1) {
        this.addRecentProject(cwd);
      } else {
        this.updateRecentProject(cwd);
      }
    },

    saveCurrentState(currentState) {
      this.updateRecentProject(currentState.project.cwd);
    },
  },
};
