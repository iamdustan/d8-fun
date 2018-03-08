let rec prep = (index, list) =>
switch index {
| 15 => list
| _ => prep(index + 1, Belt_List.concat(list, list))
};

let v = prep(0, Common.videos);

let start = Js.Date.now();

let result =
  Belt_List.reduce(
    v,
    Belt_MapInt.empty,
    ((dict, video: Common.video) =>
      Belt_MapInt.set(dict, video.id, video.title)),
  );

Js.log2("reasonml Belt", Js.Date.now() -. start);
