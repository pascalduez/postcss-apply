import fs from 'fs';
import path from 'path';
import test from 'ava';
import { expect } from 'chai';
import postcss from 'postcss';
import plugin from '../';

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');


test('apply', () => {
  const input = read('apply/input.css');
  const expected = read('apply/expected.css');

  return postcss()
    .use(plugin)
    .process(input)
    .then(result => {
      expect(result.css).to.equal(expected);
    });
});
