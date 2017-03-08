# postcss-apply

[![npm version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]


> [PostCSS] plugin enabling custom properties sets references

Aka `@apply rule`.  
Spec (editor's draft): https://tabatkins.github.io/specs/css-apply-rule  
Browser support: https://www.chromestatus.com/feature/5753701012602880  
Refers to [`postcss-custom-properties`](https://github.com/postcss/postcss-custom-properties#postcss-custom-properties-) for DOMless limitations.


## Installation

```
npm install postcss-apply --save-dev
```


## Usage

```js
const fs = require('fs');
const postcss = require('postcss');
const apply = require('postcss-apply');

const input = fs.readFileSync('input.css', 'utf8');

postcss()
  .use(apply)
  .process(input)
  .then((result) => {
    fs.writeFileSync('output.css', result.css);
  });
```

## Examples

### In CSS declared sets

```css
/* input */

:root {
  --toolbar-theme: {
    background-color: rebeccapurple;
    color: white;
    border: 1px solid green;
  };
}

.Toolbar {
  @apply --toolbar-theme;
}
```

```css
/* output */

.Toolbar {
  background-color: rebeccapurple;
  color: white;
  border: 1px solid green;
}
```

### In JS declared sets

```js
const themes = {
  /* Set names won't be transformed, just `--` will be prepended. */
  'toolbar-theme': {
    /* Declaration properties can either be camel or kebab case. */
    backgroundColor: 'rebeccapurple',
    color: 'white',
    border: '1px solid green',
  },
};

[...]
postcss().use(apply({ sets: themes }))
[...]
```

```css
/* input */

.Toolbar {
  @apply --toolbar-theme;
}
```

```css
/* output */

.Toolbar {
  background-color: rebeccapurple;
  color: white;
  border: 1px solid green;
}
```

## options

### `preserve`
type: `Boolean`  
default: `false`  
Allows for keeping resolved declarations and `@apply` rules alongside.

### `sets`  
type: `Object`  
default: `{}`  
Allows you to pass an object of custom property sets for `:root`.
These definitions will be prepended, in such overriden by the one declared in CSS if they share the same name.
The keys are automatically prefixed with the CSS `--` to make it easier to share sets in your codebase.


## Credits

* [Pascal Duez](https://github.com/pascalduez)


## Licence

postcss-apply is [unlicensed](http://unlicense.org/).



[PostCSS]: https://github.com/postcss/postcss

[npm-url]: https://www.npmjs.org/package/postcss-apply
[npm-image]: http://img.shields.io/npm/v/postcss-apply.svg?style=flat-square
[travis-url]: https://travis-ci.org/pascalduez/postcss-apply?branch=master
[travis-image]: http://img.shields.io/travis/pascalduez/postcss-apply.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/pascalduez/postcss-apply
[codecov-image]: https://img.shields.io/codecov/c/github/pascalduez/postcss-apply.svg?style=flat-square
[depstat-url]: https://david-dm.org/pascalduez/postcss-apply
[depstat-image]: https://david-dm.org/pascalduez/postcss-apply.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/postcss-apply.svg?style=flat-square
[license-url]: UNLICENSE
[spec]: https://tabatkins.github.io/specs/css-apply-rule
