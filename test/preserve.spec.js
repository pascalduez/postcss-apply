import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../src';

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');

describe('the `preserve` option', () => {
  it('should properly apply and preserve custom property sets', async () => {
    const input = read('preserve/input.css');
    const expected = read('preserve/expected.css');

    const result = await postcss()
      .use(plugin({ preserve: true }))
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });
});
