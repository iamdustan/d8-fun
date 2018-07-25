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
funReducer x 1,028,905 ops/sec ±1.05% (91 runs sampled)
funReducerWithMemo x 4,420,087 ops/sec ±0.88% (90 runs sampled)
hiddenReducer x 9,874,958 ops/sec ±0.81% (92 runs sampled)
immutableReducer x 2,190,303 ops/sec ±0.33% (94 runs sampled)
spreadReducer x 544,349 ops/sec ±0.49% (96 runs sampled)
bitsReducer x 11,528,991 ops/sec ±0.51% (95 runs sampled)
lensReducer x 1,749,660 ops/sec ±0.91% (92 runs sampled)

funUtils has fast properties: true
funReducerWithMemo has fast properties: true
hiddenUtils has fast properties: true
immutable has fast properties: true
spread has fast properties: true
lens has fast properties: true
```

The custom assoc function performs ~13x better than the generic assoc function
in this initial test case.
