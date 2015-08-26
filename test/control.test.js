'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');
var postcss = require('postcss');
var plugin = require('../');
var pluginName = require('../package.json').name;

function read(name) {
  return fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');
}

test('control', function (assert) {
  assert.plan(5);

  var input = read('control/input.css');
  var expected = read('control/expected.css');
  var css;

  // No opts.
  css = postcss([plugin]).process(input).css;
  assert.equal(css, expected);

  // PostCSS legacy API.
  css = postcss([plugin.postcss]).process(input).css;
  assert.equal(css, expected);

  // PostCSS API.
  var processor = postcss();
  processor.use(plugin);
  css = processor.process(input).toString();
  assert.equal(css, expected);

  assert.equal(processor.plugins[0].postcssPlugin, pluginName);
  assert.ok(processor.plugins[0].postcssVersion);
});
