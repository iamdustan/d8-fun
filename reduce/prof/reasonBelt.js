var reasonBelt = (function (exports) {
'use strict';

var out_of_memory = /* tuple */[
  "Out_of_memory",
  0
];

var sys_error = /* tuple */[
  "Sys_error",
  -1
];

var failure = /* tuple */[
  "Failure",
  -2
];

var invalid_argument = /* tuple */[
  "Invalid_argument",
  -3
];

var end_of_file = /* tuple */[
  "End_of_file",
  -4
];

var division_by_zero = /* tuple */[
  "Division_by_zero",
  -5
];

var not_found = /* tuple */[
  "Not_found",
  -6
];

var match_failure = /* tuple */[
  "Match_failure",
  -7
];

var stack_overflow = /* tuple */[
  "Stack_overflow",
  -8
];

var sys_blocked_io = /* tuple */[
  "Sys_blocked_io",
  -9
];

var assert_failure = /* tuple */[
  "Assert_failure",
  -10
];

var undefined_recursive_module = /* tuple */[
  "Undefined_recursive_module",
  -11
];

out_of_memory.tag = 248;

sys_error.tag = 248;

failure.tag = 248;

invalid_argument.tag = 248;

end_of_file.tag = 248;

division_by_zero.tag = 248;

not_found.tag = 248;

match_failure.tag = 248;

stack_overflow.tag = 248;

sys_blocked_io.tag = 248;

assert_failure.tag = 248;

undefined_recursive_module.tag = 248;


/*  Not a pure module */

function caml_array_sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while(j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  }
  return result;
}


/* No side effect */

function app(_f, _args) {
  while(true) {
    var args = _args;
    var f = _f;
    var arity = f.length;
    var arity$1 = arity ? arity : 1;
    var len = args.length;
    var d = arity$1 - len | 0;
    if (d) {
      if (d < 0) {
        _args = caml_array_sub(args, arity$1, -d | 0);
        _f = f.apply(null, caml_array_sub(args, 0, arity$1));
        continue ;
        
      } else {
        return (function(f,args){
        return function (x) {
          return app(f, args.concat(/* array */[x]));
        }
        }(f,args));
      }
    } else {
      return f.apply(null, args);
    }
  }
}

function curry_2(o, a0, a1, arity) {
  if (arity > 7 || arity < 0) {
    return app(o, /* array */[
                a0,
                a1
              ]);
  } else {
    switch (arity) {
      case 0 : 
      case 1 : 
          return app(o(a0), /* array */[a1]);
      case 2 : 
          return o(a0, a1);
      case 3 : 
          return (function (param) {
              return o(a0, a1, param);
            });
      case 4 : 
          return (function (param, param$1) {
              return o(a0, a1, param, param$1);
            });
      case 5 : 
          return (function (param, param$1, param$2) {
              return o(a0, a1, param, param$1, param$2);
            });
      case 6 : 
          return (function (param, param$1, param$2, param$3) {
              return o(a0, a1, param, param$1, param$2, param$3);
            });
      case 7 : 
          return (function (param, param$1, param$2, param$3, param$4) {
              return o(a0, a1, param, param$1, param$2, param$3, param$4);
            });
      
    }
  }
}

function _2(o, a0, a1) {
  var arity = o.length;
  if (arity === 2) {
    return o(a0, a1);
  } else {
    return curry_2(o, a0, a1, arity);
  }
}

function __2(o) {
  var arity = o.length;
  if (arity === 2) {
    return o;
  } else {
    return (function (a0, a1) {
        return _2(o, a0, a1);
      });
  }
}


/* No side effect */

/* No side effect */

/* No side effect */

/* No side effect */

/* No side effect */

function copyAuxCont(_cellX, _prec) {
  while(true) {
    var prec = _prec;
    var cellX = _cellX;
    if (cellX) {
      var next = /* :: */[
        cellX[0],
        /* [] */0
      ];
      prec[1] = next;
      _prec = next;
      _cellX = cellX[1];
      continue ;
      
    } else {
      return prec;
    }
  }
}

function concat$1(xs, ys) {
  if (xs) {
    var cell = /* :: */[
      xs[0],
      /* [] */0
    ];
    copyAuxCont(xs[1], cell)[1] = ys;
    return cell;
  } else {
    return ys;
  }
}

function reduceU$1(_l, _accu, f) {
  while(true) {
    var accu = _accu;
    var l = _l;
    if (l) {
      _accu = f(accu, l[0]);
      _l = l[1];
      continue ;
      
    } else {
      return accu;
    }
  }
}

function reduce$1(l, accu, f) {
  return reduceU$1(l, accu, __2(f));
}


/* No side effect */

/* No side effect */

function height(n) {
  if (n !== null) {
    return n.h;
  } else {
    return 0;
  }
}

function create(l, x, d, r) {
  var hl = height(l);
  var hr = height(r);
  return {
          left: l,
          key: x,
          value: d,
          right: r,
          h: hl >= hr ? hl + 1 | 0 : hr + 1 | 0
        };
}

function singleton(x, d) {
  return {
          left: null,
          key: x,
          value: d,
          right: null,
          h: 1
        };
}

function updateValue(n, newValue) {
  if (n.value === newValue) {
    return n;
  } else {
    return {
            left: n.left,
            key: n.key,
            value: newValue,
            right: n.right,
            h: n.h
          };
  }
}

function bal(l, x, d, r) {
  var hl = l !== null ? l.h : 0;
  var hr = r !== null ? r.h : 0;
  if (hl > (hr + 2 | 0)) {
    var ll = l.left;
    var lv = l.key;
    var ld = l.value;
    var lr = l.right;
    if (height(ll) >= height(lr)) {
      return create(ll, lv, ld, create(lr, x, d, r));
    } else {
      var lrl = lr.left;
      var lrv = lr.key;
      var lrd = lr.value;
      var lrr = lr.right;
      return create(create(ll, lv, ld, lrl), lrv, lrd, create(lrr, x, d, r));
    }
  } else if (hr > (hl + 2 | 0)) {
    var rl = r.left;
    var rv = r.key;
    var rd = r.value;
    var rr = r.right;
    if (height(rr) >= height(rl)) {
      return create(create(l, x, d, rl), rv, rd, rr);
    } else {
      var rll = rl.left;
      var rlv = rl.key;
      var rld = rl.value;
      var rlr = rl.right;
      return create(create(l, x, d, rll), rlv, rld, create(rlr, rv, rd, rr));
    }
  } else {
    return {
            left: l,
            key: x,
            value: d,
            right: r,
            h: hl >= hr ? hl + 1 | 0 : hr + 1 | 0
          };
  }
}

var empty = null;


/* No side effect */

/* No side effect */

function set$1(t, newK, newD) {
  if (t !== null) {
    var k = t.key;
    if (newK === k) {
      return updateValue(t, newD);
    } else {
      var v = t.value;
      if (newK < k) {
        return bal(set$1(t.left, newK, newD), k, v, t.right);
      } else {
        return bal(t.left, k, v, set$1(t.right, newK, newD));
      }
    }
  } else {
    return singleton(newK, newD);
  }
}

var empty$1 = empty;


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 2.2.2, PLEASE EDIT WITH CARE


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


/* No side effect */

// Generated by BUCKLESCRIPT VERSION 2.2.2, PLEASE EDIT WITH CARE

function prep(_index, _list) {
  while(true) {
    var list = _list;
    var index = _index;
    if (index !== 15) {
      _list = concat$1(list, list);
      _index = index + 1 | 0;
      continue ;
      
    } else {
      return list;
    }
  }
}

var v = prep(0, videos);

var start = Date.now();

var result = reduce$1(v, empty$1, (function (dict, video) {
        return set$1(dict, video[/* id */0], video[/* title */1]);
      }));

print("reasonml Belt", Date.now() - start);


/* v Not a pure module */

exports.prep = prep;
exports.v = v;
exports.start = start;
exports.result = result;

return exports;

}({}));
