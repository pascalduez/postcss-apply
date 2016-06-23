# postcss-apply

[![npm version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]


> [PostCSS] plugin enabling custom properties sets references

Aka `@apply rule`.  
Spec (editor's draft): https://tabatkins.github.io/specs/css-apply-rule  
Browser support: https://www.chromestatus.com/feature/5753701012602880  
Refers to [`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties#postcss-custom-properties-) for DOMless limitations, although being future proof and spec compliant is the plugin primary goal.


## Installation

```
npm install postcss-apply --save-dev
```


## Usage

```js
var fs = require('fs');
var postcss = require('postcss');
var apply = require('postcss-apply');

var input = fs.readFileSync('input.css', 'utf8');

postcss()
  .use(apply)
  .process(input)
  .then(function (result) {
    fs.writeFileSync('output.css', result.css);
  });
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

.Toolbar {
  @apply --toolbar-theme;
}

.Toolbar-title {
  @apply --toolbar-title-theme;
}
```

output:
```css
.Toolbar {
  background-color: rebeccapurple;
  color: white;
  border: 1px solid green;
}

.Toolbar-title {
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
