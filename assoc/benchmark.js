const Benchmark = require('benchmark');
const funReducer = require('./genericAssoc');
const hiddenReducer = require('./customAssoc');
const immutableReducer = require('./immutable');
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
let immutableState = immutableReducer(undefined, {type: 'INIT'});
const keys = Object.keys(funState);
suite
  .add('funReducer', () => {
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

    funState = funReducer(funState, action);
  })
  // case 2
  .add('hiddenReducer', () => {
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

    hiddenState = hiddenReducer(hiddenState, action);
  })
  .add('immutableReducer', () => {
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

    immutableState = immutableReducer(immutableState, action);
  })
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
console.log('immutable has fast properties:', %HasFastProperties(immutableState));
