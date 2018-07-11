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
funReducer x 1,051,762 ops/sec ±1.31% (91 runs sampled)
hiddenReducer x 10,299,735 ops/sec ±0.82% (93 runs sampled)
hiddenReducerWithCurrying x 4,478,021 ops/sec ±0.79% (92 runs sampled)
immutableReducer x 2,238,697 ops/sec ±0.34% (92 runs sampled)
spreadReducer x 548,059 ops/sec ±0.99% (90 runs sampled)
bitsReducer x 12,469,361 ops/sec ±1.65% (81 runs sampled)

funUtils has fast properties: true
hiddenUtils has fast properties: true
hiddenWithCurryingUtils has fast properties: true
immutable has fast properties: true
spread has fast properties: true
```

The custom assoc function performs ~13x better than the generic assoc function
in this initial test case.
