import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../src';

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');


test('apply', async () => {
  const input = read('apply/input.css');
  const expected = read('apply/expected.css');

  const result = await postcss()
    .use(plugin)
    .process(input);

  expect(result.css).toBe(expected);
});

test('overrides', async () => {
  const input = read('overrides/input.css');
  const expected = read('overrides/expected.css');

  const result = await postcss()
    .use(plugin)
    .process(input);

  expect(result.css).toBe(expected);
});
