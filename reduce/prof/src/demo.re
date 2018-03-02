type video = {
  id: int,
  title: string
};

let videos = [
  {id: 65432445, title: "The Chamber"},
  {id: 675465, title: "Fracture"},
  {id: 70111470, title: "Die Hard"},
  {id: 654356453, title: "Bad Boys"}
];

let rec prep = (index, list) =>
  switch index {
  | 15 => list
  /* rev_append is tail-recursive, very important in this case! :) */
  | _ => prep(index + 1, List.rev_append(list, list))
  };

let v = prep(0, videos);
let start = Js.Date.now();
let result = List.fold_left(
  (dict, video) => {
    Js.Dict.set(dict, string_of_int(video.id), video.title);
    dict;
  },
  Js.Dict.empty(),
  v
);
Js.log2("reasonml", Js.Date.now() -. start);
