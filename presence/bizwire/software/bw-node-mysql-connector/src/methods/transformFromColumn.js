'use strict';

const R = require('ramda');

/**
 * Properties in JS use camelCaseNames
 * @param {String} str
 * @returns {String}
 */
const delimiterAndNextLetter = /_(.)/g;
const alphaNumeric           = /[a-z0-9]/gi;
const uppercaseAlphaNumeric  = R.compose(R.toUpper, R.head, R.match(alphaNumeric));
const transformFromColumn    = R.replace(delimiterAndNextLetter, uppercaseAlphaNumeric);

module.exports = transformFromColumn;
