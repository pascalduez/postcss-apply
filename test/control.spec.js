import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../src';

const pluginName = require('../package.json').name;

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');

const expected = read('control/expected.css');
const input = read('control/input.css');

describe('control', () => {
  it('with no options', () =>
    postcss([plugin])
      .process(input, { from: undefined })
      .then(result => {
        expect(result.css).toBe(expected);
      }));

  it('with options', () =>
    postcss([plugin({})])
      .process(input, { from: undefined })
      .then(result => {
        expect(result.css).toBe(expected);
      }));

  it('PostCSS legacy API', () => {
    const result = postcss([plugin.postcss]).process(input, { from: undefined })
      .css;

    expect(result).toBe(expected);
  });

  it('PostCSS API', async () => {
    const processor = postcss();
    processor.use(plugin);

    const result = await processor.process(input, { from: undefined });

    expect(result.css).toBe(expected);

    expect(result.messages.length).toBeGreaterThan(0);

    expect(result.messages[0].type).toBe('warning');
    expect(result.messages[1].type).toBe('warning');
    expect(result.messages[2].type).toBe('warning');
    expect(result.messages[3].type).toBe('warning');

    expect(result.messages[0].text).toMatch(
      /Custom property set ignored: not scoped to top-level `:root`/
    );

    expect(result.messages[1].text).toMatch(
      /Custom property set ignored: not scoped to top-level `:root`/
    );

    expect(result.messages[2].text).toBe(
      'No custom property set declared for `this-should-warn`.'
    );

    expect(result.messages[3].text).toBe(
      'The @apply rule can only be declared inside Rule type nodes.'
    );

    expect(processor.plugins[0].postcssPlugin).toBe(pluginName);
    expect(processor.plugins[0].postcssVersion).toBeDefined();
  });
});
