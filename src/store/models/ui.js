/**
 * UI contains anything related to shared-data for...the UI.
 * e.g should siders be displayed?
 */

const initialState = {
  isBrickSelectorOpened: true,
  isFileTreeOpened: true,
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
  },
  effects: {},
};
