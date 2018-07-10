const Benchmark = require('benchmark');
const funReducer = require('./genericAssoc');
const hiddenReducer = require('./customAssoc');
const hiddenReducerWithCurrying = require('./customAssocWithCurrying');
const immutableReducer = require('./immutable');
const spreadReducer = require('./spread');
const {
  BETA_FEATURE_TOGGLED,
  BETA_FEATURE_ENABLED,
} = require('./shared');

let iteration;
let index;
var suite = new Benchmark.Suite({
  onCycle() {
    iteration = 0;
    index = 0;
  },
});
let funState = funReducer(undefined, {type: 'INIT'});
let hiddenState = hiddenReducer(undefined, {type: 'INIT'});
let curriedState = hiddenReducerWithCurrying(undefined, {type: 'INIT'});
let immutableState = immutableReducer(undefined, {type: 'INIT'});
let spreadState = spreadReducer(undefined, {type: 'INIT'});
const keys = Object.keys(funState);

const create = fn => () => {
  iteration++
  ((index++ < keys.length -1) || (index = 0));
  const action = iteration % 3
  ? {
      type: BETA_FEATURE_ENABLED,
      payload: keys[index]
    }
  : { type: BETA_FEATURE_TOGGLED,
      payload: keys[index]
    };
  fn(action);
};
suite
  .add('funReducer', create(action => { funState = funReducer(funState, action); }))
  .add('hiddenReducer', create(action => { hiddenState = hiddenReducer(hiddenState, action); }))
  .add('hiddenReducerWithCurrying', create(action => { curriedState = hiddenReducerWithCurrying(curriedState, action); }))
  .add('immutableReducer', create(action => { immutableState = immutableReducer(immutableState, action); }))
  .add('spreadReducer', create(action => { spreadState = spreadReducer(spreadState, action); }))
  .on('cycle', function(event) {
    if (event.target.aborted || event.target.error) {
      console.log(event.target.name + ' aborted');
      console.error(event.target.error);
    } else {
      console.log(String(event.target));
    }
  })
  .run({ 'async': false });

console.log('funUtils has fast properties:', %HasFastProperties(funState));
console.log('hiddenUtils has fast properties:', %HasFastProperties(hiddenState));
console.log('hiddenWithCurryingUtils has fast properties:', %HasFastProperties(curriedState));
console.log('immutable has fast properties:', %HasFastProperties(immutableState));
console.log('spread has fast properties:', %HasFastProperties(spreadState));
