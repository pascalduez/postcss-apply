import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import customProperties from 'postcss-custom-properties';
import plugin from '../src';

describe('integration', () => {
  test('custom properties declaration without plugin', async () => {
    const input = stripIndent`
      :root {
        --should-stay: 'test';
        --should-be-removed: {
          content: 'gone';
        };
      }`;

    const expected = stripIndent`
      :root {
        --should-stay: 'test';
      }`;

    const result = await postcss()
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties declaration with plugin first', async () => {
    const input = stripIndent`
      :root {
        --should-be-pruned: 'pruned';
        --should-be-removed: {
          content: 'gone';
        };
      }`;

    const expected = input;

    const result = await postcss()
      .use(customProperties)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties declaration with plugin last', async () => {
    const input = stripIndent`
      :root {
        --should-be-pruned: 'pruned';
        --should-be-removed: {
          content: 'gone';
        };
      }`;

    const expected = stripIndent`
        :root {
          --should-be-pruned: 'pruned';
        }`;

    const result = await postcss()
      .use(plugin)
      .use(customProperties)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties without plugin', async () => {
    const input = stripIndent`
      :root {
        --should-stay: 'test';
        --should-be-removed: {
          content: 'gone';
        };
      }

      .test {
        @apply --should-be-removed;
        content: var(--should-stay);
      }`;

    const expected = stripIndent`
      :root {
        --should-stay: 'test';
      }

      .test {
        content: 'gone';
        content: var(--should-stay);
      }`;

    const result = await postcss()
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties with plugin', async () => {
    const input = stripIndent`
      :root {
        --custom-prop: 'prop';
        --custom-prop-set: {
          content: 'set';
        };
      }

      .test {
        @apply --custom-prop-set;
        content: var(--custom-prop);
      }`;

    const expected = stripIndent`
      :root {
        --custom-prop: 'prop';
      }

      .test {
        content: 'set';
        content: 'prop';
        content: var(--custom-prop);
      }`;

    const result = await postcss()
      .use(customProperties)
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties nested without plugin', async () => {
    const input = stripIndent`
      :root {
        --custom-prop: 'prop';
        --custom-prop-set: {
          content: var(--custom-prop);
        };
      }

      .test {
        @apply --custom-prop-set;
        content: var(--custom-prop);
      }`;

    const expected = stripIndent`
      :root {
        --custom-prop: 'prop';
      }

      .test {
        content: var(--custom-prop);
        content: var(--custom-prop);
      }`;

    const result = await postcss()
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties nested with plugin first', async () => {
    const input = stripIndent`
      :root {
        --custom-prop: 'prop';
        --custom-prop-set: {
          content: var(--custom-prop);
        };
      }

      .test {
        @apply --custom-prop-set;
        content: var(--custom-prop);
      }`;

    const expected = stripIndent`
      :root {
        --custom-prop: 'prop';
      }

      .test {
        content: 'prop';
        content: var(--custom-prop);
        content: 'prop';
        content: var(--custom-prop);
      }`;

    const result = await postcss()
      .use(customProperties)
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties nested with plugin last', async () => {
    const input = stripIndent`
      :root {
        --custom-prop: 'prop';
        --custom-prop-set: {
          content: var(--custom-prop);
        };
      }

      .test {
        @apply --custom-prop-set;
        content: var(--custom-prop);
      }`;

    const expected = stripIndent`
      :root {
        --custom-prop: 'prop';
      }

      .test {
        content: 'prop';
        content: var(--custom-prop);
        content: 'prop';
        content: var(--custom-prop);
      }`;

    const result = await postcss()
      .use(plugin)
      .use(customProperties)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties nested with plugin first [preserve: false]', async () => {
    const input = stripIndent`
      :root {
        --custom-prop: 'prop';
        --custom-prop-set: {
          content: var(--custom-prop);
        };
      }

      .test {
        @apply --custom-prop-set;
        content: var(--custom-prop);
      }`;

    const expected = stripIndent`
      .test {
        content: 'prop';
        content: 'prop';
      }`;

    const result = await postcss()
      .use(customProperties({ preserve: false }))
      .use(plugin)
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });

  test('custom properties nested with plugin last [preserve: false]', async () => {
    const input = stripIndent`
      :root {
        --custom-prop: 'prop';
        --custom-prop-set: {
          content: var(--custom-prop);
        };
      }

      .test {
        @apply --custom-prop-set;
        content: var(--custom-prop);
      }`;

    const expected = stripIndent`
      .test {
        content: 'prop';
        content: 'prop';
      }`;

    const result = await postcss()
      .use(plugin)
      .use(customProperties({ preserve: false }))
      .process(input, { from: undefined });

    expect(result.css).toBe(expected);
  });
});
