const lru = require('lru-cache');
const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');
 const createMemoizeFactoryWithDepth_forSingleStringFunction = (depth) => {
  const memoizeFn = fn => {
    const cache = lru({
      max: depth,
    });

    return function(arg) {
      if (!cache.has(arg)) {
        cache.set(arg, fn(arg));
      }
      return cache.get(arg);
    };
  };

  return memoizeFn;
};

const memo = createMemoizeFactoryWithDepth_forSingleStringFunction(11);

const assoc = memo(key => value => state => {
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
});

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
