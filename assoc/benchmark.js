const Benchmark = require('benchmark');
const funReducer = require('./genericAssoc');
const funReducerWithMemo = require('./genericAssocWithMemo');
const hiddenReducer = require('./customAssoc');
const runtimeReducer = require('./customAssocRuntime');
const immutableReducer = require('./immutable');
const spreadReducer = require('./spread');
const bitsReducer = require('./bits');
const lensReducer = require('./lens');
const {
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

let iteration = 0;
let index = 0;
var suite = new Benchmark.Suite({
  onCycle() {
    iteration = 0;
    index = 0;
  },
});
const states = new Map();
states.set(funReducer, funReducer(undefined, {type: 'INIT'}));
states.set(funReducerWithMemo, funReducerWithMemo(undefined, {type: 'INIT'}));
states.set(hiddenReducer, hiddenReducer(undefined, {type: 'INIT'}));
states.set(runtimeReducer, runtimeReducer(undefined, {type: 'INIT'}));
states.set(immutableReducer, immutableReducer(undefined, {type: 'INIT'}));
states.set(spreadReducer, spreadReducer(undefined, {type: 'INIT'}));
states.set(bitsReducer, bitsReducer(undefined, {type: 'INIT'}));
states.set(lensReducer, lensReducer(undefined, {type: 'INIT'}));
const keys = Object.keys(states.get(funReducer));

const create = fn => () => {
  iteration++
  ((index++ < keys.length -1) || (index = 0));
  const action = iteration % 3
  ? {
      type: BETA_FEATURE_ENABLED,
      payload: keys[index],
    }
  : { type: BETA_FEATURE_TOGGLED,
      payload: keys[index],
    };
  fn(action);
};
const bench = (name, fn) => {
  let lastState = states.get(fn);
  return () => {
    iteration++
    ((index++ < keys.length -1) || (index = 0));
    const action = iteration % 3
    ? { type: BETA_FEATURE_ENABLED, payload: keys[index] }
    : { type: BETA_FEATURE_TOGGLED, payload: keys[index] };

    const nextState = fn(lastState, action);
    if (%HaveSameMap(lastState, nextState) === false) {
      console.error(`${name} lost it’s hidden class on iteration ${iteration}`);
    }
    states.set(fn, nextState);
    lastState = nextState;
  };
};
suite
  .add('funReducer', bench('funReducer', funReducer))
  .add('funReducerWithMemo', bench('funReducerWithMemo', funReducerWithMemo))
  .add('hiddenReducer', bench('hiddenReducer', hiddenReducer))
  .add('hiddenReducerRuntime', bench('runtimeReducer', runtimeReducer))
  .add('immutableReducer', bench('immutableReducer', immutableReducer))
  .add('spreadReducer', bench('spreadReducer', spreadReducer))
  .add('bitsReducer', bench('bitsReducer', bitsReducer))
  .add('lensReducer', bench('lensReducer', lensReducer))
  .on('cycle', function(event) {
    if (event.target.aborted || event.target.error) {
      console.log(event.target.name + ' aborted');
      console.error(event.target.error);
    } else {
      console.log(String(event.target));
    }
  })
  .run({ 'async': false });

console.log('funUtils has fast properties:', %HasFastProperties(states.get(funReducer)));
/*
console.log('funReducerWithMemo has fast properties:', %HasFastProperties(curriedState));
console.log('hiddenState has fast properties:', %HasFastProperties(hiddenState));
console.log('hiddenStateRuntime has fast properties:', %HasFastProperties(runtimeState));
console.log('immutable has fast properties:', %HasFastProperties(immutableState));
console.log('spread has fast properties:', %HasFastProperties(spreadState));
console.log('lens has fast properties:', %HasFastProperties(lensState));
*/
