## Comparison of `Object.entries(o).reduce` vs custom `Object.keys(o).reduce`

This is an exploration of the GC and runtime cost of this pattern that we call
_a lot_ in our codebase.

**Setup**

We have two different test runs as displayed below. Each has the same setup
data and the difference is in how we create our reduced result.

* `Object.entries(o).reduce(fn, {});`
* `Object.keys(o).reduce(fn, [{}, o]));`

In the test, `o` has 100 entries and we execute this code 100 times.

**Object.entries**

```js
const accumulateState = (memo, [name, {state}]) => {
  memo[name] = state;
  return memo;
};
const accumulatedState = Object.entries(stores).reduce(accumulateState, {});
```

**Object.keys**

```js
const accumulateState = (memo, name) => {
  memo[0][name] = memo[1][name].state;
  return memo;
};
const accumulatedState = Object.keys(stores).reduce(accumulateState, [{}, stores])[0]
```

**For loop**

```js
const accumulatedState = {};
for (const key in stores) {
  if (stores.hasOwnProperty(key)) {
    accumulatedState[key] = stores[key].name;
  }
}
```

---

**GC Pauses**

* entries: 213
* keys: 138
* loop: 137

<details>

<summary>output of `d8 --trace-gc` for each example</summary>

| entries | keys | loop |
|----|----|----|
| 27 ms: Scavenge 3.8 (5.2) -> 3.0 (6.2) MB, 1.1 / 0.0 ms  allocation failure  | 25 ms: Scavenge 3.8 (5.2) -> 3.0 (6.2) MB, 1.1 / 0.0 ms  allocation failure  | 27 ms: Scavenge 4.3 (6.7) -> 3.4 (7.7) MB, 1.0 / 0.0 ms  allocation failure  |
| 35 ms: Scavenge 4.3 (7.7) -> 3.5 (8.2) MB, 1.0 / 0.0 ms  allocation failure  | 31 ms: Scavenge 4.3 (7.7) -> 3.4 (8.2) MB, 0.6 / 0.0 ms  allocation failure  | 32 ms: Scavenge 4.3 (7.7) -> 3.4 (8.2) MB, 0.7 / 0.0 ms  allocation failure  |
| 41 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 34 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 36 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 46 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 38 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 40 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 53 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 41 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 43 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 59 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 44 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 46 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 64 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 48 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 50 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 70 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 51 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 54 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 77 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 54 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 57 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 84 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 57 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 60 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 89 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 61 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 64 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 95 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 64 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 68 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 100 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 67 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 71 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 106 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 71 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 75 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 111 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 74 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 79 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 116 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 77 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 82 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 122 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 81 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 86 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 128 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 84 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 90 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 134 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 87 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 93 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 139 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 91 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 97 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 147 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 94 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 100 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 153 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 97 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 104 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 158 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 100 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 107 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 164 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 104 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 111 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 171 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 107 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 114 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 178 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 110 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 118 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 183 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 114 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 122 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 188 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 117 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 125 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 194 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 122 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 129 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 200 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 125 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 133 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 206 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 128 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 136 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 212 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 131 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 140 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 217 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 134 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 143 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 223 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 137 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 147 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 228 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 140 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 151 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 234 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 143 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 154 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 243 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 146 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 158 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 249 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 150 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 161 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 254 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 154 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 165 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 260 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 157 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 168 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 266 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 160 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 172 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 271 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 163 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 175 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 276 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 166 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 178 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 282 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 168 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 182 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 287 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 171 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 185 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 294 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 174 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 189 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 299 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 177 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 192 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 304 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 180 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 196 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 310 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 183 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 199 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 315 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 186 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 203 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 322 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 190 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 207 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 328 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 193 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 210 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 333 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 196 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 214 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 339 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 198 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 217 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 345 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 201 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 221 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 350 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 205 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 224 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 356 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 208 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 228 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 361 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 210 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 232 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 367 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 213 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 236 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 372 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 216 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 240 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 377 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 219 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 243 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 383 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 222 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 247 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 388 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 225 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 250 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 394 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 228 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 253 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 399 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 231 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 257 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 405 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 234 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 261 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 410 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 237 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 264 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 416 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 240 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 268 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 421 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 242 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 271 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 426 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 245 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 275 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 432 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 248 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 278 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 438 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 252 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 282 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 443 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 255 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 285 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 448 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 257 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 289 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 454 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 260 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 293 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  |
| 460 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 263 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 297 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 465 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 266 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 300 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 471 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 269 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 304 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 476 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 273 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 308 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  |
| 482 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 276 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 313 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 488 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 279 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 317 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 493 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 282 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 322 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 499 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 285 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 326 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 504 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 288 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 330 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 509 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 291 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 334 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 514 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 294 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 338 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 520 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 297 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 341 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 526 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  | 300 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 344 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 532 ms: Scavenge 4.4 (8.2) -> 3.4 (10.2) MB, 1.3 / 0.0 ms  allocation failure  | 303 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 348 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 542 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 306 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 353 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 553 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 308 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 357 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 564 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 311 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 360 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 575 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 314 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 364 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 588 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 317 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 367 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 598 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 320 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 371 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 609 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 323 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 374 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  |
| 620 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 326 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 378 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 631 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 329 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 381 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 641 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 332 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 385 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 651 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 334 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 389 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  |
| 662 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 337 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 392 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 672 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 340 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 396 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 682 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 343 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 399 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 693 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 346 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 403 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 704 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 349 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 407 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 714 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 352 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 411 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 725 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 355 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 414 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 737 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 358 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 418 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 747 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 361 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 422 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 758 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 364 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 425 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 768 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 367 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 429 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 779 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 370 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 433 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.4 / 0.0 ms  allocation failure  |
| 789 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 373 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 436 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 799 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 376 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 440 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 810 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 378 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 444 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 821 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 381 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 448 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 831 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 384 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 452 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 844 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 387 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 456 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 855 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 390 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 460 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 866 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 393 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 463 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 876 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 396 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 467 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 887 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 399 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 471 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 898 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 402 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 474 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 909 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 405 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 479 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 920 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 410 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 484 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 931 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 413 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 487 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 942 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 416 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 490 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 952 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 419 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 494 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 963 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.6 / 0.0 ms  allocation failure  | 422 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  | 498 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.3 / 0.0 ms  allocation failure  |
| 974 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 425 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 501 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 984 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 429 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 505 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 995 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 432 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 509 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 1008 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 435 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 512 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 1019 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 438 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 516 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 1030 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 441 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 520 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  |
| 1041 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 444 ms: Scavenge 4.4 (8.2) -> 3.4 (8.2) MB, 0.2 / 0.0 ms  allocation failure  | 501ms |
| 1051 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  | 424ms | 522 ms: Scavenge 4.2 (8.2) -> 3.6 (8.2) MB, 0.2 / 0.0 ms  idle task  |
| 1061 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  | 445 ms: Scavenge 4.0 (8.2) -> 3.6 (8.2) MB, 0.2 / 0.0 ms  idle task  |  |
| 1072 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1083 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1093 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1106 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1117 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1128 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1139 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1150 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1161 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1171 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1182 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1192 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1203 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1213 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1224 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1234 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1244 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1256 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1266 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1277 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1287 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1298 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1308 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1318 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1329 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1340 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1351 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1362 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1372 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1382 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1393 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1403 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1413 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1424 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1434 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1445 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1455 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1466 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1477 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1487 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1499 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1509 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1521 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1532 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1543 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1554 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1565 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1576 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1588 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1598 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1609 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1620 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1631 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1643 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1654 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1664 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1675 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1685 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1697 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1708 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1718 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1729 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1739 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1749 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1760 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1770 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1781 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1791 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1802 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1813 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1824 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1834 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1844 ms: Scavenge 5.4 (10.2) -> 3.5 (10.2) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1828ms |  |  |
| 1850 ms: Scavenge 4.5 (10.2) -> 3.6 (10.2) MB, 0.4 / 0.0 ms  idle task  |  |  |

</details>


## Runtime in Different Engines


I thought it would be interesting to do a follow-up test measuring the runtime
length of each of these with [`eshost`](https://github.com/bterlson/eshost-cli)

I wrapped each reduction in a simple Date.now time delta calculation like:
`const s = Date.now(); /* ... */;console.log(Date.now() - s);. 

| Engine         | entries |  keys  | forloop | reasonml |
|----------------|--------:|-------:|--------:|---------:|
| Chakra         |   845   |  373   |   187   |   todo   |
| SpiderMonkey   |   264   |  201   |   174   |   todo   |
| V8             |   396   |  168   |   186   |   todo   |
| JavaScriptCore |   235   |  179   |   134   |   todo   |


