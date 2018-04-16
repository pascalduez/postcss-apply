import postcss from 'postcss';
import plugin from '../src';

const input = `
:root {
  /* This should be pruned */
  --toolbar-theme: {
    color: orangeRed;
  }
}

.toolbar {
  @apply --toolbar-theme;
}
`;

let from;

describe('comments', () => {
  it('should remove immediate preceding comments in declarations', async () => {
    const result = await postcss()
      .use(plugin)
      .process(input, { from });

    expect(result.css).toMatchSnapshot();
  });

  it('should not remove immediate preceding comments in declarations with the preserve option', async () => {
    const result = await postcss()
      .use(plugin({ preserve: true }))
      .process(input, { from });

    expect(result.css).toMatchSnapshot();
  });
});
