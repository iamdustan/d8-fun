const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

const assoc = (state, key, value) => {
  if (state[key] === value) {
    return state;
  }
  const result = {
    linkUpload: state.linkUpload,
    peek: state.peek,
    rssUrl: state.rssUrl,
    contentEditorEnabled: state.contentEditorEnabled,
    isCommerceBetaAvailable: state.isCommerceBetaAvailable,
    finder: state.finder,
    contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
    stylePanel: state.stylePanel,
    cssGrid: state.cssGrid,
    condVisItemRef: state.condVisItemRef,
    disableBlockers: state.disableBlockers,
  };
  result[key] = value;
  return result;
};

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return assoc(state, action.payload, true);
    case BETA_FEATURE_TOGGLED:
      return assoc(state, action.payload, !state[action.payload]);
    default:
      return state;
  }
};
