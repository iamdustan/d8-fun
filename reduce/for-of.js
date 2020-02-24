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
const start = Date.now();
let value = (() => {
  let result = {};
  for (const v of videos) {
    v[v.id] = v.title;
  }
  return result;
})();

print('for-of', Date.now() - start);

