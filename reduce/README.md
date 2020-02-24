## Iteration Allocation Cost

This is an exploration of the GC cost of different iteration methods in V8.
jsperf shows similar results for runtime cost, but that doesn’t take into
account GC pressure.

**Setup**

We have three different test runs as displayed below. Each has the same setup
data and the difference is in how we create our reduced result. Allocation, extension, or mutation.

The array length is 131,027 items.

```js
let videos = [{
  "id": 65432445,
  "title": "The Chamber"
}, {
  "id": 675465,
  "title": "Fracture"
}, {
  "id": 70111470,
  "title": "Die Hard"
}, {
  "id": 654356453,
  "title": "Bad Boys"
}];

let i = 0;
while (i++ < 15) {
  videos.push(...videos);
}
```

**Alloc**

```js
videos.reduce((a, v) => Object.assign({}, a, {[v.id]: v.title}), {});
```

**Extend**

```js
videos.reduce((a, v) => Object.assign(a, {[v.id]: v.title}), {});`
```

**Mutate**
```
videos.reduce((a, v) => {
  acc[video.id] = video.title;
  return acc;
}, {});
```

---

**GC Pauses**
* alloc: 184
* extend: 76
* mutate: 1
* for-of: 7
* prof/reason: 9
* prof/reasonBelt: 10

<details>

<summary>output of `d8 --trace-gc` for each example</summary>


| alloc | extend | mutate | for-of | prof/reason | prof/reasonBelt |
|----|----|----|
| 86 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 7.1 / 0.0 ms  allocation failure  | 83 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 7.4 / 0.0 ms  allocation failure  | mutate  104 | 90 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 6.9 / 0.0 ms  allocation failure  | 25 ms: Scavenge 4.0 (6.7) -> 3.8 (7.7) MB, 3.1 / 0.0 ms  allocation failure  |
| 101 ms: Scavenge 6.2 (8.9) -> 5.2 (9.4) MB, 6.6 / 0.0 ms  allocation failure  | 98 ms: Scavenge 6.2 (8.9) -> 5.2 (9.4) MB, 6.7 / 0.0 ms  allocation failure  |  | 121 ms: Scavenge 6.7 (10.4) -> 5.7 (10.9) MB, 6.7 / 0.0 ms  allocation failure  | 31 ms: Scavenge 4.0 (7.7) -> 3.9 (8.7) MB, 3.7 / 0.0 ms  allocation failure  |
| 111 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.4 / 0.1 ms  allocation failure  | 106 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  |  | 141 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 35 ms: Scavenge 4.8 (8.7) -> 4.8 (10.7) MB, 3.7 / 0.0 ms  allocation failure  |
| 120 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 114 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  |  | 161 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 41 ms: Scavenge 5.9 (10.7) -> 5.9 (11.7) MB, 5.9 / 0.0 ms  allocation failure  |
| 129 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 122 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  |  | 181 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 49 ms: Scavenge 6.7 (11.7) -> 6.7 (16.7) MB, 8.4 / 0.0 ms  allocation failure  |
| 139 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 132 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  | 201 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 61 ms: Scavenge 9.8 (16.7) -> 9.9 (17.7) MB, 11.2 / 0.0 ms  allocation failure  |
| 148 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 140 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  | for-of 121 | 78 ms: Scavenge 10.6 (17.7) -> 10.5 (28.7) MB, 16.7 / 0.0 ms  allocation failure  |
| 158 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 147 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  | reasonml 138 |
| 167 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 155 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  | 223 ms: Scavenge 11.1 (28.7) -> 11.1 (29.7) MB, 6.4 / 0.0 ms  idle task  |
| 176 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 163 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 187 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 171 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |
| 198 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 178 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 207 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 186 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 216 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 194 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 225 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 202 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 234 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 209 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 243 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 217 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 253 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 225 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 262 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 234 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |
| 271 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 243 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 281 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 251 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 290 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 258 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 299 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 266 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 308 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 273 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 317 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 281 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 326 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 289 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 335 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 296 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 345 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 305 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 354 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 312 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 363 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 320 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 373 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 328 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 382 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 336 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 391 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 343 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 400 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 351 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 409 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 359 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 418 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 366 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 427 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 375 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 436 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 383 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 446 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 390 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 455 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 398 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 464 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  | 406 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 473 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 414 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 483 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 422 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 492 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 430 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 501 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 437 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 510 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 445 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 519 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 454 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 531 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 461 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 540 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 469 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 549 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 477 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 559 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 485 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 568 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 493 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 577 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 501 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 586 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 509 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 596 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 517 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 606 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 525 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 615 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 532 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 624 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 541 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 633 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 550 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 643 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 559 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 652 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 567 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 661 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 574 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 670 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 582 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 679 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 590 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 688 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 598 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 701 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 605 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 710 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 614 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 719 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 621 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 728 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 629 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 738 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 637 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 747 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 644 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 756 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 652 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 765 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 660 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 775 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 667 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 785 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 675 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 795 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | extend  603 |  |  |  |
| 804 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 813 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 822 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 831 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 841 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 850 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 859 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 870 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 879 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 889 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 898 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 907 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 917 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 926 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 935 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 944 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 954 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 963 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 972 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 982 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 991 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1000 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1010 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1019 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1029 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1041 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1052 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1061 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1070 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1080 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1090 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1100 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1109 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1119 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1128 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1138 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1147 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1156 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1166 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1175 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1185 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1195 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1205 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1214 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1223 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1232 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1241 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1251 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1260 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1269 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1278 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1288 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1297 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1306 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1316 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1327 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1337 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1347 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1357 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1366 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1375 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1384 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1393 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1402 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1412 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1421 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1430 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1439 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1448 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1458 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1468 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1477 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1486 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1496 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1505 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1514 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1523 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1533 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1542 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1551 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1560 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1570 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1579 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1588 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1597 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1607 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1616 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1625 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1635 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1644 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1653 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1662 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1671 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1680 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1689 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1700 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1709 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1718 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1727 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1736 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1746 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1755 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1765 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1775 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1784 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1793 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1803 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| alloc  1727 |  |  |  |  |
|  |  |  |  |  |

</details>


## Runtime in Different Engines

I thought it would be interesting to do a follow-up test measuring the runtime
length of each of these with [`eshost`](https://github.com/bterlson/eshost-cli)

I wrapped each reduction in a simple Date.now time delta calculation like:
`const s = Date.now(); /* ... */;print(Date.now() - s + 'ms');`.

> *Don’t trust the reasonml output currently.*

| Engine           | alloc   | extend   | mutate   | for-of        | reasonml   | reason+belt   |
| ---------------- | ------: | -------: | -------: | ------------: | ---------: | ------------: |
| Chakra           | 436     | 170      | 29       | 26            | 27         | 17            |
| SpiderMonkey     | 400     | 92       | 16       | 25            | 23         | 13            |
| V8               | 580     | 212      | 26       | 21            | 21         | 13            |
| JavaScriptCore   | 466     | 226      | 39       | 38            | 18         | 16            |
| jsc              | 473     | 170      | 16       | 32            | 18         | 16            |


