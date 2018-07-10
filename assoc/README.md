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
$ node --allow-natives-syntax assoc/benchmark.js
funReducer x 1,034,945 ops/sec ±0.84% (91 runs sampled)
hiddenReducer x 13,977,885 ops/sec ±1.43% (91 runs sampled)
immutableReducer x 2,281,783 ops/sec ±0.78% (93 runs sampled)
funUtils has fast properties: true
hiddenUtils has fast properties: true
immutable has fast properties: true
```

The custom assoc function performs ~13x better than the generic assoc function
in this initial test case.
