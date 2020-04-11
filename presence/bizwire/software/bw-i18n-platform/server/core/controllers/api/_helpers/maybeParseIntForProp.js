'use strict';

const R = require('ramda');

const maybeParseIntForProp = k => R.when(
  R.has(k),
  R.over(
    R.lensProp(k),
    R.partialRight(parseInt, [10])
  )
);

module.exports = maybeParseIntForProp;
