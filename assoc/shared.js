const defaultState = {
  linkUpload: false,
  peek: false,
  rssUrl: false,
  contentEditorEnabled: true,
  isCommerceBetaAvailable: false,
  finder: false,
  contentEditorDataManagerEnabled: false,
  stylePanel: false,
  cssGrid: false,
  condVisItemRef: false,
  disableBlockers: false,
};

module.exports = {
  BETA_FEATURE_ENABLED: 'enable',
  BETA_FEATURE_TOGGLED: 'toggle',
  defaultState
};
