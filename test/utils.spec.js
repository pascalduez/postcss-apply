import kebabify from '../src/utils';


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
