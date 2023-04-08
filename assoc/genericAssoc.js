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

const hasOwn = Object.prototype.hasOwnProperty;
const objectKeys = Object.keys;
const has = key => object => hasOwn.call(object, key);
const funAssoc = key => {
  const hasKey = has(key);
  return value => object => {
    if (hasKey(object) && object[key] === value) {
      return object;
    }

    const result = objectKeys(object).reduce(assocReducer, {
      source: object,
      result: {},
    }).result;

    result[key] = value;

    return result;
  };
};

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return funAssoc(action.payload)(true)(state);
    case BETA_FEATURE_TOGGLED:
      return funAssoc(action.payload)(!state[action.payload])(state);
    default:
      return state;
  }
};
module.exports.assoc = funAssoc;
