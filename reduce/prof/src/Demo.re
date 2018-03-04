let rec prep = (index, list) =>
switch index {
| 15 => list
/* rev_append is tail-recursive, very important in this case! :) */
| _ => prep(index + 1, List.rev_append(list, list))
};

let v = prep(0, Common.videos);
let start = Js.Date.now();
let result = List.fold_left(
  (dict, video: Common.video) => {
    Js.Dict.set(dict, string_of_int(video.id), video.title);
    dict;
  },
  Js.Dict.empty(),
  v
);
Js.log2("reasonml", Js.Date.now() -. start);
