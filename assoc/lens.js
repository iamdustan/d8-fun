const {
  defaultState,
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');
const {create} = Object;

const returnThis = function() {
  return this;
};

const IDENTITY = '@webflow/Identity/value';

const identityPrototype = {
  map(f) { return Identity(f(this[IDENTITY])); },
};

const Identity = value => {
  const object = create(identityPrototype);
  object[IDENTITY] = value;
  return object;
};

const runIdentity = object => object[IDENTITY];
const OPTION = '@webflow/Option';

class Option {
  /*
  map: <b>((a) => b) => Option<b>;
  chain: <b>((a) => Option<b>) => Option<b>;
  ap: *; // TODO: How do we type this?;
  alt: (Option<a>) => Option<a>;
  concat: (Option<a>) => Option<a>;
  fold: <b>(b, (a) => b) => b;
  */
}

const None = create({
  map: returnThis,
  chain: returnThis,
  alt: alternativeOption => alternativeOption,
  ap: returnThis,
  concat: other => other,
  fold: fallback => fallback,
});

const Some = value => {
  const object = create(SomePrototype);
  object[OPTION] = value;
  return object;
};

const SomePrototype = {
  map(f) {
    return Some(f(this[OPTION]));
  },
  chain(f) {
    return f(this[OPTION]);
  },
  alt: returnThis,
  ap(m) {
    return m.map(this[OPTION]);
  },
  concat(other) {
    return other.fold(this, otherValue => Some(this[OPTION].concat(otherValue)));
  },
  fold(fallback, mapValue) {
    return mapValue(this[OPTION]);
  },
};

const maybe = fallback => mapValue => option =>
  option.fold(fallback, mapValue);
const fromNullable = value => (value == null ? None : Some(value));
const hasOwn = Object.prototype.hasOwnProperty;
const has = key => object => hasOwn.call(object, key);

const lens = getter => setter => toFunctor => target =>
  toFunctor(getter(target)).map(focus => setter(focus)(target));

const over = l => f => {
  const toFunctor = compose(Identity)(f);
  return compose(runIdentity)(l(toFunctor));
};

const lookup = key => {
  const hasKey = has(key);
  return object => (hasKey(object) ? Some(object[key]) : None);
};

const linkUpload = lens(s => s.linkUpload)(newValue => state =>
  state.linkUpload === linkUpload
    ? state
    : {
        linkUpload,
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
      },
);

const peek = lens(s => s.peek)(newValue => state =>
  state.peek === peek
    ? state
    : {
        linkUpload: state.linkUpload,
        peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const rssUrl = lens(s => s.rssUrl)(newValue => state =>
  state.rssUrl === rssUrl
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const contentEditorEnabled = lens(s => s.contentEditorEnabled)(newValue => state =>
  state.contentEditorEnabled === contentEditorEnabled
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const isCommerceBetaAvailable = lens(s => s.isCommerceBetaAvailable)(newValue => state =>
  state.isCommerceBetaAvailable === isCommerceBetaAvailable
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const finder = lens(s => s.finder)(newValue => state =>
  state.finder === finder
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const contentEditorDataManagerEnabled = lens(s => s.contentEditorDataManagerEnabled)(newValue => state =>
  state.contentEditorDataManagerEnabled === contentEditorDataManagerEnabled
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const stylePanel = lens(s => s.stylePanel)(newValue => state =>
  state.stylePanel === stylePanel
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const cssGrid = lens(s => s.cssGrid)(newValue => state =>
  state.cssGrid === cssGrid
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid,
        condVisItemRef: state.condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const condVisItemRef = lens(s => s.condVisItemRef)(newValue => state =>
  state.condVisItemRef === condVisItemRef
    ? state
    : {
        linkUpload: state.linkUpload,
        peek: state.peek,
        rssUrl: state.rssUrl,
        contentEditorEnabled: state.contentEditorEnabled,
        isCommerceBetaAvailable: state.isCommerceBetaAvailable,
        finder: state.finder,
        contentEditorDataManagerEnabled: state.contentEditorDataManagerEnabled,
        stylePanel: state.stylePanel,
        cssGrid: state.cssGrid,
        condVisItemRef,
        disableBlockers: state.disableBlockers,
      },
);

const disableBlockers = lens(s => s.disableBlockers)(newValue => state =>
  state.disableBlockers === disableBlockers
    ? state
    : {
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
        disableBlockers,
      },
);

const lenses = {
  linkUpload,
  peek,
  rssUrl,
  contentEditorEnabled,
  isCommerceBetaAvailable,
  finder,
  contentEditorDataManagerEnabled,
  stylePanel,
  cssGrid,
  condVisItemRef,
  disableBlockers,
};
const compose = f => g => x => f(g(x));
const alwaysTrue = () => true;
const not = v => !v;

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case BETA_FEATURE_ENABLED:
      return over(lenses[action.payload])(alwaysTrue)(state);
    case BETA_FEATURE_TOGGLED:
      return over(lenses[action.payload])(not)(state);
    default:
      return state;
  }
};
