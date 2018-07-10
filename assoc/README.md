## Reducer Updater Costs

This is an exploration of the runtime difference of a few different takes on
reducer updates. One uses a very functional approach to associating new values,
another uses a custom assoc implementation per record, and yet another uses
Immutable.js structures.

To run:

* `yarn install`
* `node --allow-natives-syntax ./assoc/benchmark.js`

## Output

```sh
funReducer x 985,497 ops/sec ±1.07% (90 runs sampled)
hiddenReducer x 9,612,552 ops/sec ±0.79% (91 runs sampled)
hiddenReducerWithCurrying x 4,252,116 ops/sec ±0.98% (90 runs sampled)
immutableReducer x 2,146,983 ops/sec ±0.25% (95 runs sampled)
spreadReducer x 525,291 ops/sec ±0.53% (94 runs sampled)
funUtils has fast properties: true
hiddenUtils has fast properties: true
hiddenWithCurryingUtils has fast properties: true
immutable has fast properties: true
spread has fast properties: true
```

The custom assoc function performs ~13x better than the generic assoc function
in this initial test case.
