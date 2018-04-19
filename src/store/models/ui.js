/**
 * UI contains anything related to shared-data for...the UI.
 * e.g should siders be displayed?
 */

const initialState = {
  isBrickSelectorOpened: true,
  isFileTreeOpened: true,
  isTodoListOpened: true,
};

export default {
  state: { ...initialState },
  reducers: {
    toggleIsBrickSelectorOpened(state) {
      return {
        ...state,
        isBrickSelectorOpened: !state.isBrickSelectorOpened,
      };
    },

    toggleIsFileTreeOpened(state) {
      return {
        ...state,
        isFileTreeOpened: !state.isFileTreeOpened,
      };
    },

    toggleIsTodoListOpened(state) {
      return {
        ...state,
        isTodoListOpened: !state.isTodoListOpened,
      };
    },
  },
  effects: {},
};
