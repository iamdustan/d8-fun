const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

const keys = Object.keys(defaultState);

const assocReducer = (acc, key) => {
  acc.result[key] = acc.source[key];
  return acc;
};

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return {
        ...state,
        [action.payload]: true
      };
    case BETA_FEATURE_TOGGLED:
      return {
        ...state,
        [action.payload]: !state[action.payload],
      };
    default:
      return state;
  }
};
