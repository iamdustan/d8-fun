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
* prof/reason: 9
* prof/reasonBelt: 10

<details>

<summary>output of `d8 --trace-gc` for each example</summary>

| alloc | extend | mutate | prof/reason | prof/reasonBelt |
|----|----|----|
| 89 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 6.8 / 0.0 ms  allocation failure  | 96 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 7.5 / 0.0 ms  allocation failure  | alloc  92 | 29 ms: Scavenge 4.0 (6.7) -> 3.8 (7.7) MB, 3.2 / 0.0 ms  allocation failure  | 32 ms: Scavenge 4.0 (6.7) -> 3.9 (7.7) MB, 3.2 / 0.0 ms  allocation failure  |
| 106 ms: Scavenge 6.2 (8.9) -> 5.2 (9.4) MB, 7.9 / 0.0 ms  allocation failure  | 115 ms: Scavenge 6.2 (8.9) -> 5.2 (9.4) MB, 7.1 / 0.0 ms  allocation failure  |  | 35 ms: Scavenge 4.0 (7.7) -> 3.9 (8.7) MB, 3.5 / 0.0 ms  allocation failure  | 35 ms: Scavenge 4.0 (7.7) -> 3.9 (8.7) MB, 3.5 / 0.0 ms  allocation failure  |
| 117 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 129 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.5 / 0.0 ms  allocation failure  |  | 39 ms: Scavenge 4.8 (8.7) -> 4.8 (10.7) MB, 3.7 / 0.0 ms  allocation failure  | 39 ms: Scavenge 4.8 (8.7) -> 4.8 (10.7) MB, 3.7 / 0.0 ms  allocation failure  |
| 126 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 144 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.4 / 0.0 ms  allocation failure  |  | 45 ms: Scavenge 5.9 (10.7) -> 5.9 (11.7) MB, 5.6 / 0.0 ms  allocation failure  | 45 ms: Scavenge 5.9 (10.7) -> 5.9 (11.7) MB, 5.9 / 0.0 ms  allocation failure  |
| 137 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.3 / 0.0 ms  allocation failure  | 158 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.3 / 0.0 ms  allocation failure  |  | 53 ms: Scavenge 6.7 (11.7) -> 6.7 (16.7) MB, 8.1 / 0.0 ms  allocation failure  | 53 ms: Scavenge 6.8 (11.7) -> 6.8 (16.7) MB, 7.9 / 0.0 ms  allocation failure  |
| 147 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 170 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  | 64 ms: Scavenge 9.8 (16.7) -> 9.9 (17.7) MB, 10.7 / 0.0 ms  allocation failure  | 64 ms: Scavenge 9.8 (16.7) -> 9.9 (17.7) MB, 10.5 / 0.0 ms  allocation failure  |
| 157 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 180 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  | 84 ms: Scavenge 10.6 (17.7) -> 10.5 (28.7) MB, 19.4 / 0.0 ms  allocation failure  | 81 ms: Scavenge 10.7 (17.7) -> 10.6 (28.7) MB, 16.3 / 0.0 ms  allocation failure  |
| 168 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.4 / 0.0 ms  allocation failure  | 192 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  | reasonml 144 | 99 ms: Scavenge 17.7 (28.7) -> 11.1 (29.7) MB, 4.6 / 0.0 ms  allocation failure  |
| 178 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 203 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  | 233 ms: Scavenge 11.1 (28.7) -> 11.1 (29.7) MB, 5.2 / 0.0 ms  idle task  | reasonml Belt 18 |
| 187 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 212 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  | 102 ms: Scavenge 12.6 (29.7) -> 11.1 (30.7) MB, 2.5 / 0.0 ms  idle task  |
| 198 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 222 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 210 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 231 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 220 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 239 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 229 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 249 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 239 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 258 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 247 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 266 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 256 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 274 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 264 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 283 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 274 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 291 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 283 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 299 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 293 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 307 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 302 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 315 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 313 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 324 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 322 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 333 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 331 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 341 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 340 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 349 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 352 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  | 357 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |
| 362 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 365 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 371 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 373 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 382 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  | 381 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 392 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 389 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 402 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 397 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 412 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 405 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 422 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 413 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 431 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 421 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 441 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  | 429 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 450 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 437 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 460 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 445 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 469 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  | 453 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 478 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 461 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 488 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 469 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 497 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 477 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 507 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 485 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 516 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 493 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 526 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 502 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 536 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 509 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 547 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 517 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 556 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 527 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 566 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 535 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 574 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 543 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 583 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 553 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 592 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 562 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 601 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 570 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 611 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 577 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 620 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 585 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 628 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 592 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 638 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 600 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 647 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 608 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 656 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 616 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 666 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 624 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 676 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 632 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 686 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 641 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 695 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 650 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 705 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 658 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 714 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 666 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 724 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 674 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 733 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 681 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 742 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 688 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 750 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 696 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 759 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 705 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 768 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 713 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 776 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 721 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 785 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 728 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 793 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 736 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |
| 802 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 746 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |
| 810 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | alloc  662 |  |  |  |
| 822 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 831 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 840 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 848 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 860 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 870 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 878 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 889 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 900 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 909 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 918 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 927 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 935 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 944 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 953 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 962 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 971 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 980 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 990 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1000 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1012 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1021 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1032 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.5 / 0.0 ms  allocation failure  |  |  |  |  |
| 1043 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1054 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1066 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1079 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1091 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1103 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1113 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1128 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1143 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1156 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1170 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1184 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1196 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1206 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1216 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1226 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1235 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1245 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1254 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1263 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1273 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1282 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1291 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1300 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1311 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 1.0 / 0.0 ms  allocation failure  |  |  |  |  |
| 1325 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1336 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1346 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1355 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1365 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1375 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1384 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1395 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1404 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1413 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1422 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1431 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1440 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1449 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1458 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1470 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1479 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1489 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1499 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1510 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1519 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1529 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1538 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1549 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1558 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1567 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1576 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1587 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1596 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1607 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1618 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1627 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1636 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1646 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1655 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1665 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1676 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1684 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1693 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1703 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1712 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1721 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1731 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1741 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1750 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1759 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1768 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1777 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1786 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1795 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1803 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1812 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |  |  |
| 1824 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |  |  |
| 1834 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1844 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1855 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1865 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1874 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| 1883 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |  |  |
| alloc  1803 |  |  |  |  |

</details>


## Runtime in Different Engines


I thought it would be interesting to do a follow-up test measuring the runtime
length of each of these with [`eshost`](https://github.com/bterlson/eshost-cli)

I wrapped each reduction in a simple Date.now time delta calculation like:
`const s = Date.now(); /* ... */;print(Date.now() - s + 'ms');`.

| Engine         | alloc | extend | mutate | reasonml | reason+belt |
|----------------|------:|-------:|-------:|---------:|------------:|
| Chakra         |  291  |   99   |    19  |    27    |      17     |
| SpiderMonkey   |  164  |   49   |    10  |    23    |      13     |
| V8             |  315  |  114   |    12  |    21    |      13     |
| JavaScriptCore |  251  |   97   |    12  |    18    |      16     |

