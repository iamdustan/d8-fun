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
funReducer x 1,044,866 ops/sec ±0.62% (94 runs sampled)
funReducerWithMemo x 4,257,566 ops/sec ±0.86% (90 runs sampled)
hiddenReducer x 10,008,810 ops/sec ±0.82% (95 runs sampled)
hiddenReducerRuntime x 10,129,961 ops/sec ±0.54% (93 runs sampled)
immutableReducer x 2,145,697 ops/sec ±0.71% (93 runs sampled)
spreadReducer x 527,406 ops/sec ±0.50% (93 runs sampled)
bitsReducer x 11,117,506 ops/sec ±0.68% (87 runs sampled)
lensReducer x 1,724,989 ops/sec ±0.94% (85 runs sampled)

funUtils has fast properties: true
funReducerWithMemo has fast properties: true
hiddenState has fast properties: true
hiddenStateRuntime has fast properties: true
immutable has fast properties: true
spread has fast properties: true
lens has fast properties: true
```

The custom assoc function performs ~13x better than the generic assoc function
in this initial test case.
