import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../src';

const pluginName = require('../package.json').name;

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');

const expected = read('control/expected.css');
const input = read('control/input.css');


test('control: no options', () =>
  postcss([plugin])
    .process(input)
    .then((result) => {
      expect(result.css).toBe(expected);
    }));

test('control: with options', () =>
  postcss([plugin({})])
    .process(input)
    .then((result) => {
      expect(result.css).toBe(expected);
    }));

test('control: PostCSS legacy API', () => {
  const result = postcss([plugin.postcss]).process(input).css;

  expect(result).toBe(expected);
});

test('control: PostCSS API', async () => {
  const processor = postcss();
  processor.use(plugin);

  const result = await processor.process(input);

  expect(result.css).toBe(expected);

  expect(result.messages.length).toBeGreaterThan(0);

  expect(result.messages[0].type).toBe('warning');
  expect(result.messages[1].type).toBe('warning');

  expect(result.messages[0].text)
    .toMatch(/Custom property set ignored: not scoped to top-level `:root`/);

  expect(result.messages[1].text)
    .toBe('No custom property set declared for `this-should-warn`.');

  expect(processor.plugins[0].postcssPlugin).toBe(pluginName);
  expect(processor.plugins[0].postcssVersion).toBeDefined();
});
