const exec = require('child_process').execSync;

const d8 = "~/projects/oss/v8/out.gn/x64.optdebug/d8"

const cases = [
  'alloc',
  'extend',
  'mutate',
  'for-of',
  'prof/reason',
  'prof/reasonBelt',
];

const traces = cases.map(c => {
  // console.log(`Tracing ${c}.js`);
  return exec(`${d8} --trace-gc ${c}.js`, { shell: '/bin/zsh' })
    .toString()
    .split('\n')
    // remove preceding address spaceQ
    .map(str => str.replace(/\[([^\]])*\]\s+/, ''));
});


const table = traces[0].reduce((memo, cur, i, all) => {
  return memo.concat('| ' + [
    cur, (traces[1][i] || ''),
    (traces[2][i] || ''),
    (traces[3][i] || ''),
    (traces[4][i] || ''),
  ].join(' | ') + ' |');
}, []).join('\n');

console.log('GC Pauses');
traces.forEach((t, i) => console.log('%s: %s', cases[i], t.length - 1));
console.log('| ' + cases.join(' | ') + ' |');
console.log('|----|----|----|');
console.log(table);
