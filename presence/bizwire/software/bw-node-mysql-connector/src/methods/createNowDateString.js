'use strict';

/**
 * Create a date string in the format [YYYY-MM-DD]
 * @returns {String}
 */
module.exports = () => require('moment')().format('YYYY-MM-DD');
