'use strict';

const R = require('ramda');

/**
 * Return fuzzy search wrapper around provided search term.
 * @param {String} searchTerm
 * @returns {String}
 */
const fuzzify = R.replace(/q/, R.__, '%q%');

module.exports = fuzzify;
