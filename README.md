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
* alloc: 183
* extend: 75
* mutate: 0

<details>

<summary>output of `d8 --trace-gc` for each example</summary>

| alloc | extend | mutate |
|----|----|----|
| 97 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 7.1 / 0.0 ms  allocation failure  | 95 ms: Scavenge 6.2 (7.9) -> 5.2 (8.9) MB, 7.1 / 0.0 ms  allocation failure  |  |
| 113 ms: Scavenge 6.2 (8.9) -> 5.2 (9.4) MB, 7.2 / 0.0 ms  allocation failure  | 109 ms: Scavenge 6.2 (8.9) -> 5.2 (9.4) MB, 6.5 / 0.0 ms  allocation failure  |  |
| 123 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.5 / 0.0 ms  allocation failure  | 117 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 132 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 125 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 142 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 133 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 151 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 144 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 160 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 151 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 171 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 159 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 183 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.2 / 0.0 ms  allocation failure  | 167 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 192 ms: Scavenge 6.2 (9.4) -> 5.2 (9.4) MB, 0.3 / 0.0 ms  allocation failure  | 176 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 203 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 183 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 215 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 192 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 227 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 200 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 236 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 208 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 245 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 216 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 254 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 224 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 262 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.5 / 0.0 ms  allocation failure  | 232 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 271 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 241 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 282 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 248 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 293 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 259 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 302 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 268 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 311 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 276 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 321 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 285 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 330 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 293 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 340 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 301 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 349 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 309 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 359 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 318 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 368 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 326 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 377 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 334 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 386 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 342 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 396 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 350 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 405 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 359 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 414 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 367 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 424 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 375 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 433 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 385 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 442 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 393 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 452 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 402 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 462 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 410 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 471 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.6 / 0.0 ms  allocation failure  | 418 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 481 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 426 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 490 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 434 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 499 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 442 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 508 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 451 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 518 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 460 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 527 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 468 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 535 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 476 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 545 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 485 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 554 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 493 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 565 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 500 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 574 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 509 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 583 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 519 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 593 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 528 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 602 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 536 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 612 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.5 / 0.0 ms  allocation failure  | 544 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 621 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 553 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 630 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 561 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 639 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 569 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 648 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 577 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 656 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 584 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 666 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 593 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 677 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 601 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 687 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 610 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 696 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 618 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 705 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 626 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 714 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 634 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 723 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 642 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 733 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 650 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 742 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 658 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 752 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 666 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 761 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 674 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 770 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 682 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 780 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 690 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 790 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 698 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |
| 799 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  | 707 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.5 / 0.0 ms  allocation failure  |  |
| 808 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  | 715 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |
| 819 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 828 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 839 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 849 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 858 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 867 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 876 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 885 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 895 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 906 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 916 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 930 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 942 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 951 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 959 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 968 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 977 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 990 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1004 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1016 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1026 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1035 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1044 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1054 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1069 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1083 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1092 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1102 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1111 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1120 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1130 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1139 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1148 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1158 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1167 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1176 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1185 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1194 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1203 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1212 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1221 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1230 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1240 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1249 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1258 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1267 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1278 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1287 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1296 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1305 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1314 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1323 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1332 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1341 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1350 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1359 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1368 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1377 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1386 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1395 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1405 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1414 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1424 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1433 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1442 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1451 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1460 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1471 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1483 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1492 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1502 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1511 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1521 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1530 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1540 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.5 / 0.0 ms  allocation failure  |  |  |
| 1549 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1559 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1569 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1579 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1588 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1597 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1606 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1616 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1625 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1634 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1646 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1656 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1665 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1674 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1684 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1693 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1702 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1711 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |
| 1720 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1729 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1738 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1747 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1757 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1766 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1775 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1786 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1795 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1804 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1814 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.3 / 0.0 ms  allocation failure  |  |  |
| 1824 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1833 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1842 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.2 / 0.0 ms  allocation failure  |  |  |
| 1852 ms: Scavenge 6.7 (10.9) -> 5.7 (10.9) MB, 0.4 / 0.0 ms  allocation failure  |  |  |

</details>


## Runtime in Different Engines


I thought it would be interesting to do a follow-up test measuring the runtime
length of each of these with [`eshost`](https://github.com/bterlson/eshost-cli)

I wrapped each reduction in a simple Date.now time delta calculation like:
`const s = Date.now(); /* ... */;console.log(Date.now() - s);.

| Engine       | alloc | extend | mutate | reasonml |
|--------------|------:|-------:|-------:|---------:|
| Chakra       |  291  |   99   |    19  |    27    |
| SpiderMonkey |  164  |   49   |    10  |    23    |
| V8           |  315  |  114   |    12  |    21    |
