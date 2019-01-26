import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';

describe('prepend', () => {
  describe('should prepend sets from options', () => {
    it('from an object set', async () => {
      const input = stripIndent`
        .dummy {
          @apply --justatest;
        }
      `;

      const sets = {
        justatest: {
          padding: '0 1rem',
          fontSize: '1.4rem',
          color: 'tomato',
        },
      };

      const result = await postcss()
        .use(plugin({ sets }))
        .process(input, { from: undefined });

      expect(result.css).toMatchSnapshot();
    });

    it('from a string set', async () => {
      const input = stripIndent`
        .dummy {
          @apply --justatest;
        }
      `;

      const sets = {
        justatest: `
          fontSize: 1.4rem;

          @media (width >= 500px) {
            fontSize: 2.4rem;
          }
        `,
      };

      const result = await postcss()
        .use(plugin({ sets }))
        .process(input, { from: undefined });

      expect(result.css).toMatchSnapshot();
    });

    it('throws if the set is not an object or a string', async () => {
      const input = stripIndent`
        .dummy {
          @apply --justatest;
        }
      `;

      const sets = {
        justatest: () => {},
      };

      expect(() => {
        postcss() // eslint-disable-line no-unused-expressions
          .use(plugin({ sets }))
          .process(input, { from: undefined }).css;
      }).toThrow(
        'Unrecognized set type `function`, must be an object or string.'
      );
    });
  });

  it('should override sets from options with CSS declared ones', async () => {
    const input = stripIndent`
      :root {
        --justatest: {
          padding: none;
          color: orangeRed;
        }
      }

      .dummy {
        @apply --justatest;
      }
    `;

    const sets = {
      justatest: {
        padding: '0 1rem',
        fontSize: '1.4rem',
        color: 'tomato',
      },
    };

    const result = await postcss()
      .use(plugin({ sets }))
      .process(input, { from: undefined });

    expect(result.css).toMatchSnapshot();
  });

  it('should be able to be nested inside a CSS declared set', async () => {
    const input = stripIndent`
      :root {
        --from-css: {
          @apply --from-js;
        }
      }

      .dummy {
        @apply --from-css;
      }
    `;

    const sets = {
      'from-js': {
        color: 'tomato',
      },
    };

    const result = await postcss()
      .use(plugin({ sets }))
      .process(input, { from: undefined });

    expect(result.css).toMatchSnapshot();
  });
});
