// btoa polyfill from https://github.com/davidchambers/Base64.js/blob/master/base64.js
const btoa = (() => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }
  InvalidCharacterError.prototype = new Error;
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  return function (input) {
    var str = String(input);
    for (
      // initialize result and counter
      var block, charCode, idx = 0, map = chars, output = '';
      // if the next str index does not exist:
      //   change the mapping table to "="
      //   check if d has no fractional digits
      str.charAt(idx | 0) || (map = '=', idx % 1);
      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
    ) {
      charCode = str.charCodeAt(idx += 3/4);
      if (charCode > 0xFF) {
        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      }
      block = block << 8 | charCode;
    }
    return output;
  };
})();

const state = {};
const repeat = (times, fn) => {
  const result = new Array(times - 1);
  const length = times - 1;
  do {
    result[length - times] = fn();
  } while (times--);
  return result;
};
const createStore = () => {
  const value = Math.random() * 100000 | 0;
  const store = btoa('store_' + value).slice(8);
  const key = 'state_key_' + (Math.random() * 20 | 0);
  // we want the store shape to share a hidden class,
  // but not the state key
  return {
    name: store,
    state: {
      [key]: value,
    },
  };
};


const stores = repeat(100, createStore).reduce((memo, store) => {
  memo[store.name] = store;
  return memo;
}, {});

// ------------------------------------------------------------------------
// actual test here
//

const start = Date.now();
const accumulateState = (memo, [name, {state}]) => {
  memo[name] = state;
  return memo;
};
repeat(10000, () => {
  const accumulatedState = Object.entries(stores).reduce(accumulateState, {});
});
print((Date.now() - start) + 'ms');
