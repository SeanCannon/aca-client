'use strict';

const prepareProvidedFieldsForSet = require('../../../../server/core/utils/db/methods/prepareProvidedFieldsForSet');

describe('prepareProvidedFieldsForSet', () => {
  it('makes a prepared statement for each field', () => {
    expect(prepareProvidedFieldsForSet(['foo', 'bar'])).toBe('`bar` = ?,`foo` = ?');
  });
});
