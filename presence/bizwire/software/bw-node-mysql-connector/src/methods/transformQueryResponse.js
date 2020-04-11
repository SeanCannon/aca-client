'use strict';

const R = require('ramda');

const transformFromColumn = require('./transformFromColumn');

const transformPair = pair => [transformFromColumn(pair[0]), pair[1]];

const transformDBObject = obj => R.fromPairs(R.map(transformPair, R.toPairs(obj)));

/**
 * Transforms a db query response so that the table column names
 * become more JavaScript friendly:
 * @example `date_created` becomes `dateCreated`.
 * @param [Object|Array] data
 * @returns {Object|Array}
 */
const transformQueryResponse = R.ifElse(R.is(Array), R.map(transformDBObject), transformDBObject);

module.exports = transformQueryResponse;
