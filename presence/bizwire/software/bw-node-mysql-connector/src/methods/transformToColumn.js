'use strict';

const R = require('ramda');

/**
 * Fields in the DB use underscored_names
 * @param {String} str
 * @returns {String}
 */
const preHumpCharacters = /([a-z\d])([A-Z0-9])/g;
const underscoreDelimit = R.replace(preHumpCharacters, '$1_$2');
const wrapWithTicks     = str => '`' + str + '`';
const transformToColumn = R.compose(wrapWithTicks, R.toLower, underscoreDelimit);

module.exports = transformToColumn;
