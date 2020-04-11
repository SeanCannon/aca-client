'use strict';

const transformFromColumn = require('../../../../server/core/utils/db/methods/transformFromColumn');

describe('transformFromColumn', () => {
  it('transforms a string from the case used ' +
    'for MySQL fields to the case used for JS variables', () => {
    expect(transformFromColumn('some_db_field')).toBe('someDbField');
  });
});
