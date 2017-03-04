import postcss from 'postcss';
import customProperties from 'postcss-custom-properties';
import plugin from '../src';

describe('integration', () => {
  test('custom properties declaration without plugin', async () => {
    const input = `
      :root {
        --should-stay: 'test';
        --should-be-removed: {
          content: 'gone';
        };
      }`;

    const expected = `
      :root {
        --should-stay: 'test';
      }`;

    const processor = postcss();
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties declaration with plugin first', async () => {
    const input = `
      :root {
        --should-be-pruned: 'pruned';
        --should-be-removed: {
          content: 'gone';
        };
      }`;

    const expected = '';

    const processor = postcss();
    processor.use(customProperties);
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties declaration with plugin last', async () => {
    const input = `
      :root {
        --should-be-pruned: 'pruned';
        --should-be-removed: {
          content: 'gone';
        };
      }`;

    const expected = '';

    const processor = postcss();
    processor.use(plugin);
    processor.use(customProperties);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties without plugin', async () => {
    const input = `
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

    const expected = `
      :root {
        --should-stay: 'test';
      }

      .test {
        content: 'gone';
        content: var(--should-stay);
      }`;

    const processor = postcss();
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties with plugin', async () => {
    const input = `
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

    const expected = `
      .test {
        content: 'set';
        content: 'prop';
      }`;

    const processor = postcss();
    processor.use(customProperties);
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties nested without plugin', async () => {
    const input = `
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

    const expected = `
      :root {
        --custom-prop: 'prop';
      }

      .test {
        content: var(--custom-prop);
        content: var(--custom-prop);
      }`;

    const processor = postcss();
    // processor.use(customProperties);
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties nested with plugin first', async () => {
    const input = `
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

    const expected = `
      .test {
        content: 'prop';
        content: 'prop';
      }`;

    const processor = postcss();
    processor.use(customProperties);
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });


  test('custom properties nested with plugin last', async () => {
    const input = `
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

    const expected = `
      .test {
        content: 'prop';
        content: 'prop';
      }`;

    const processor = postcss();
    processor.use(plugin);
    processor.use(customProperties);

    const result = await processor.process(input);

    expect(result.css).toBe(expected);
  });
});
