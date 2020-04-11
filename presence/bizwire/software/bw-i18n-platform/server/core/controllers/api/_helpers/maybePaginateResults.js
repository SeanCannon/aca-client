'use strict';

const R = require('ramda');

const maybeParseIntFromPath = require('./maybeParseIntFromPath');

const maybePaginateResults = R.curry((req, arr) => {
  const pageNum  = R.defaultTo(1,        maybeParseIntFromPath(['query', 'pageNum'], req)),
        perPage  = R.defaultTo(Infinity, maybeParseIntFromPath(['query', 'perPage'], req)),
        pageLens = R.lensIndex(R.dec(pageNum));

  return R.compose(R.defaultTo([]), R.view(pageLens), R.splitEvery(perPage))(arr);
});

module.exports = maybePaginateResults;
