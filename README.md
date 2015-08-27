# postcss-apply

[![npm version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]


> [PostCSS] plugin enabling custom properties sets references

**Disclaimer**:  
Just toying around an interesting idea, not even a [spec].  
The plugin is in a very early state, some features are missing.


## Installation

```
npm install postcss-apply --save-dev
```


## Usage

```js
var fs = require('fs');
var postcss = require('postcss');
var apply = require('postcss-apply');

var css = fs.readFileSync('input.css', 'utf8');

var output = postcss()
  .use(apply)
  .process(css)
  .css;
```

## Examples

input:
```css
:root {
  --toolbar-theme: {
    background-color: rebeccapurple;
    color: white;
    border: 1px solid green;
  };
  --toolbar-title-theme: {
    color: green;
  };
}

.toolbar {
  @apply --toolbar-theme;
}
.toolbar__title {
  @apply --toolbar-title-theme;
}
```

output:
```css
.toolbar {
  background-color: rebeccapurple;
  color: white;
  border: 1px solid green;
}
.toolbar__title {
  color: green;
}
```


## Credits

* [Pascal Duez](https://twitter.com/pascalduez)


## Licence

postcss-apply is [unlicensed](http://unlicense.org/).



[PostCSS]: https://github.com/postcss/postcss

[npm-url]: https://www.npmjs.org/package/postcss-apply
[npm-image]: http://img.shields.io/npm/v/postcss-apply.svg?style=flat-square
[travis-url]: https://travis-ci.org/pascalduez/postcss-apply?branch=master
[travis-image]: http://img.shields.io/travis/pascalduez/postcss-apply.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/pascalduez/postcss-apply
[coveralls-image]: https://img.shields.io/coveralls/pascalduez/postcss-apply.svg?style=flat-square
[depstat-url]: https://david-dm.org/pascalduez/postcss-apply
[depstat-image]: https://david-dm.org/pascalduez/postcss-apply.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/postcss-apply.svg?style=flat-square
[license-url]: UNLICENSE
[spec]: https://tabatkins.github.io/specs/css-apply-rule
