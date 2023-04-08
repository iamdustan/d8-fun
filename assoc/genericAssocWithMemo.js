const lru = require('lru-cache');
const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');
const funAssoc = require('./genericAssoc').assoc;
 const createMemoizeFactoryWithDepth_forSingleStringFunction = (depth) => {
  const memoizeFn = fn => {
    const cache = lru({
      max: depth,
    });

    return function(arg) {
      if (!cache.has(arg)) {
        cache.set(arg, fn(arg));
      } else {
        // todo: test memoizing a second layer
        // console.log(arg, cache.get(arg));
      }
      return cache.get(arg);
    };
  };

  return memoizeFn;
};

const memo = createMemoizeFactoryWithDepth_forSingleStringFunction(11);

const assoc = memo(funAssoc);
module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return assoc(action.payload)(true)(state);
    case BETA_FEATURE_TOGGLED:
      return assoc(action.payload)(!state[action.payload])(state);
    default:
      return state;
  }
};
