import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  plugins: [
    babel({
      exclude: ['node_modules/**'],
      babelHelpers: 'bundled'
    }),
    json(),
    resolve(),
    commonjs(),
  ],
  external: ['postcss', 'balanced-match'],
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'default',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
};
