'use strict';

/**
 * Create a unix time stamp for "now"
 * @returns {number}
 */
module.exports = () => require('moment')().format('X') * 1;
