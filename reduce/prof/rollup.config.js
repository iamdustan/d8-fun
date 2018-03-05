import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/Demo.bs.js',
    output: {
      name: 'reason',
      file: 'reason.js',
      format: 'iife'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  },
  {
    input: 'src/DemoBelt.bs.js',
    output: {
      name: 'reasonBelt',
      file: 'reasonBelt.js',
      format: 'iife'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  },
];
