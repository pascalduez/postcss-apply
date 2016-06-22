import test from 'ava';
import { expect } from 'chai';
import postcss from 'postcss';
import customProperties from 'postcss-custom-properties';
import plugin from '../';


test('integration: custom properties without plugin', () => {
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

  return processor.process(input).then(result => {
    expect(result.css).to.equal(expected);
  });
});


test('integration: custom properties with plugin first', () => {
  const input = `
    :root {
      --should-stay: 'test';
      --should-be-removed: {
        content: 'gone';
      };
    }`;

  const expected = '';

  const processor = postcss();
  processor.use(customProperties);
  processor.use(plugin);

  return processor.process(input).then(result => {
    expect(result.css).to.equal(expected);
  });
});


test('integration: custom properties with plugin last', () => {
  const input = `
    :root {
      --should-stay: 'test';
      --should-be-removed: {
        content: 'gone';
      };
    }`;

  const expected = '';

  const processor = postcss();
  processor.use(plugin);
  processor.use(customProperties);

  return processor.process(input).then(result => {
    expect(result.css).to.equal(expected);
  });
});


test('integration: custom properties with no plugin', () => {
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

  return processor.process(input).then(result => {
    expect(result.css).to.equal(expected);
  });
});


test('integration: custom properties with plugin', () => {
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

  return processor.process(input).then(result => {
    expect(result.css).to.equal(expected);
  });
});
