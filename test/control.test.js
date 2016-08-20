/* eslint-disable no-unused-expressions */

import fs from 'fs';
import path from 'path';
import test from 'ava';
import { expect } from 'chai';
import postcss from 'postcss';
import plugin from '../';

const pluginName = require('../package.json').name;

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');

const expected = read('control/expected.css');
const input = read('control/input.css');


test('control: no options', () =>
  postcss([plugin])
    .process(input)
    .then(result => {
      expect(result.css).to.equal(expected);
    }));

test('control: with options', () =>
  postcss([plugin({})])
    .process(input)
    .then(result => {
      expect(result.css).to.equal(expected);
    }));

test('control: PostCSS legacy API', () => {
  const result = postcss([plugin.postcss]).process(input).css;
  expect(result).to.equal(expected);
});

test('control: PostCSS API', async () => {
  const processor = postcss();
  processor.use(plugin);

  const result = await processor.process(input);

  expect(result.css).to.equal(expected);

  expect(result.messages.length).to.be.ok;

  expect(result.messages[0].type)
    .to.equal('warning');

  expect(result.messages[0].text)
    .to.equal('Custom properties sets are only allowed on `:root` rules.');

  expect(result.messages[1].type)
    .to.equal('warning');

  expect(result.messages[1].text)
    .to.equal('No custom properties set declared for `this-should-warn`.');

  expect(processor.plugins[0].postcssPlugin).to.equal(pluginName);
  expect(processor.plugins[0].postcssVersion).to.be.ok;
});
