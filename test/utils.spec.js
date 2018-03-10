import { kebabify, isPlainObject } from '../src/utils';

describe('kekabify', () => {
  it('should convert camelCase properties to kebab-case', () => {
    const input = [
      'borderRadius',
      'backgroundColor',
      'background-color',
      'fontSize',
      'font-size',
      'borderTopLeftRadius',
      '-moz-Whatever',
      '-webkit-whoCares',
      '--customProp',
      '--CustomProp',
      '--custom-prop',
    ];

    const result = input.map(kebabify);

    expect(result).toMatchSnapshot();
  });
});

describe('isPlainObject', () => {
  it('should assert for plain object types', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('')).toBe(false);
  });
});
