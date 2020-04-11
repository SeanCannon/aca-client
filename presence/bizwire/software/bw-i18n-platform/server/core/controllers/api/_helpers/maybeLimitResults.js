'use strict';

const R = require('ramda');

const maybeParseIntFromPath = require('./maybeParseIntFromPath');

const maybeLimitResults = R.curry((req, results) => {
  const limitTo = R.defaultTo(Infinity, maybeParseIntFromPath(['query', 'limitTo'], req));

  return R.take(limitTo, results);
});

module.exports = maybeLimitResults;
