const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

const createCloneStr = obj =>
 `var clone = {${Object.keys(obj).reduce(
   (s, k) => `${s}${k}:state.${k},`,
   ''
 )}};`;
const createUpdater = obj => {
 const body = `if (state[key] === value) return state;${createCloneStr(
   obj
 )}clone[key] = value;return clone;`;

 return new Function('state', 'key', 'value', body);
};
const assoc = createUpdater(defaultState);
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
