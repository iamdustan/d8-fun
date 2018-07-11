const {
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

const link            = 0b00000000001;
const peek            = 0b00000000010;
const rssUrl          = 0b00000000100;
const contentEditor   = 0b00000001000;
const ecommerce       = 0b00000010000;
const finder          = 0b00000100000;
const contentEditerDM = 0b00001000000;
const stylePanel      = 0b00010000000;
const cssGrid         = 0b00100000000;
const condVisItemRef  = 0b01000000000;
const disableBlockers = 0b10000000000;

const states = {
  link, peek, rssUrl, contentEditor, ecommerce, finder,
  contentEditerDM, stylePanel, cssGrid, condVisItemRef,
  disableBlockers,
};
const defaultState = contentEditor;

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return state & states[action.payload];
    case BETA_FEATURE_TOGGLED:
      return state | states[action.payload];
    default:
      return state;
  }
};

