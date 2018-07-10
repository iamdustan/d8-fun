const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

const {Record} = require('immutable');
const StateRecord = Record(defaultState);
const defaultImmutableState = new StateRecord;
const not = value => !value;

module.exports = (state = defaultImmutableState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return state.set(action.payload, true);
    case BETA_FEATURE_TOGGLED:
      return state.update(action.payload, not);
    default:
      return state;
  }
};
