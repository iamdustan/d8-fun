// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

import * as List       from "bs-platform/lib/es6/list.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";

var videos = /* :: */[
  /* record */[
    /* id */65432445,
    /* title */"The Chamber"
  ],
  /* :: */[
    /* record */[
      /* id */675465,
      /* title */"Fracture"
    ],
    /* :: */[
      /* record */[
        /* id */70111470,
        /* title */"Die Hard"
      ],
      /* :: */[
        /* record */[
          /* id */654356453,
          /* title */"Bad Boys"
        ],
        /* [] */0
      ]
    ]
  ]
];

function prep(_index, _list) {
  while(true) {
    var list = _list;
    var index = _index;
    if (index !== 15) {
      _list = List.rev_append(list, list);
      _index = index + 1 | 0;
      continue ;
      
    } else {
      return list;
    }
  };
}

var v = prep(0, videos);

var start = Date.now();

var result = List.fold_left((function (dict, video) {
        dict[Pervasives.string_of_int(video[/* id */0])] = video[/* title */1];
        return dict;
      }), { }, v);

console.log("reasonml", Date.now() - start);

export {
  videos ,
  prep   ,
  v      ,
  start  ,
  result ,
  
}
/* v Not a pure module */
