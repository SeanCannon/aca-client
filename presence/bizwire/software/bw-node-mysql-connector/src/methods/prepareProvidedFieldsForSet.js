'use strict';

const R = require('ramda');

const transformToColumn = require('./transformToColumn'),
      commaSeparate     = R.join(',');

/**
 * Converts an array of fields into a prepared statement for SQL
 * @param {Array} fields
 * @returns {String}
 */
const prepareProvidedFieldsForSet = fields => {
  const fieldsCopy    = R.clone(fields).sort();
  const prepareField  = R.curry((marker, field) => {
    return transformToColumn(field) + ' = ' + marker;
  });
  const prepareFields = R.compose(commaSeparate, R.map(prepareField('?')));

  return prepareFields(fieldsCopy);
};

module.exports = prepareProvidedFieldsForSet;
