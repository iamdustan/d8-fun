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
let result = videos.reduce((acc, video) => Object.assign(acc, {[video.id]: video.title}), {});
print('alloc ', Date.now() - start);

