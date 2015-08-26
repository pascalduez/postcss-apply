'use strict';

var fs = require('fs');
var path = require('path');
var postcss = require('postcss');
var plugin = require('../');

function read(name) {
  return fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');
}

['apply'].forEach(function (test) {
  var input = read(test + '/input.css');
  var css = postcss(plugin).process(input).css;
  console.log(css);
});
