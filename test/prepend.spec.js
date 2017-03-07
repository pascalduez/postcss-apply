import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';


describe('prepend', () => {
  it('should prepend sets from options', async () => {
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
      .process(input);

    expect(result.css).toMatchSnapshot();
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
      .process(input);

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
      .process(input);

    expect(result.css).toMatchSnapshot();
  });
});
