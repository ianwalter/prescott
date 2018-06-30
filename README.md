# Prescott
> A super-simple templating language

[![Npm page][npm-image]][npm-url]
[![Build status][build-image]][build-url]

## About

Prescott is a templating language based on custom html/xml elements and extended
with a [mustache](http://mustache.github.io/) syntax for values `{{ example }}`.
It is made possible using [PEG.js](https://pegjs.org/), inspired by using
[Vue.js](https://vuejs.org/), and used by [Generates]() to generate project
files for scaffolding/bootstrapping.

## Installation

```fish
npm install --save prescott
```

## Usage

```js
import { compile } from 'prescott'

const template = '{{ name }}'
const data = { name: 'Coleman' }
const render = compile(template)
const output = render(data)
// Outputs: Coleman
```

&nbsp;

ISC &copy; [Ian Walter](https://iankwalter.com)

[npm-image]: https://img.shields.io/npm/v/prescott.svg
[npm-url]: https://www.npmjs.com/package/prescott
[build-image]: https://travis-ci.com/ianwalter/prescott.svg?branch=master
[build-url]: https://travis-ci.com/ianwalter/prescott

