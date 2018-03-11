import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../src';

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');

describe('apply', () => {
  it('should properly apply and remove custom property sets', async () => {
    const input = read('apply/input.css');
    const expected = read('apply/expected.css');

    const result = await postcss()
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  it('should properly apply custom property sets overrides', async () => {
    const input = read('overrides/input.css');
    const expected = read('overrides/expected.css');

    const result = await postcss()
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });
});
