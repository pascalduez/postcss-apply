'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');
var postcss = require('postcss');
var plugin = require('../');

function read(name) {
  return fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');
}

test('apply', function (assert) {
  assert.plan(1);

  var input = read('apply/input.css');
  var expected = read('apply/expected.css');
  var css = postcss([plugin]).process(input).css;

  assert.equal(css, expected);
});
