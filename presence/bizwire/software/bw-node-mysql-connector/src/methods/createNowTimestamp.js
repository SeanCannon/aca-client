'use strict';

/**
 * Create a timestamp string in the format [YYYY-MM-DD HH:mm:ss]
 * @returns {String}
 */
module.exports = () => require('moment')().format('YYYY-MM-DD HH:mm:ss');
