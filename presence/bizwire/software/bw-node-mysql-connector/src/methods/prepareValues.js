'use strict';

const R = require('ramda');

/**
 * Prepares an array of values for a prepared statement.
 * @param {Object} data
 * @returns {Array}
 */
const prepareValues = data => {
  const dataCopy = R.clone(data),
        getProp  = R.flip(R.prop),
        prop     = getProp(dataCopy),
        fields   = Object.keys(dataCopy).sort();

  return fields.map(prop);
};

module.exports = prepareValues;
