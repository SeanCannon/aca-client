'use strict';

const R = require('ramda');

/**
 * Accepts an array.
 * If the array has only one item, it returns that item,
 * otherwise it returns the original array.
 * Why? This library has two exposed APIs for fetching data: query and lookup.
 * Query is expected to return a collection. Lookup is expected to return a single record.
 * It's inconvenient for known single record returns to be contained in an array, so here we are.
 * Query does not ever use this, lookup always does.
 *
 * @see DB.query
 * @see DB.lookup
 * @param {Array}
 * @returns {*}
 */
const ensureNotSingleItemArray = R.ifElse(R.compose(R.identical(R.__, 1), R.length), R.head, R.identity);

module.exports = ensureNotSingleItemArray;
