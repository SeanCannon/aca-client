'use strict';

const fuzzify = require('../../../../server/core/utils/db/methods/fuzzify');

describe('fuzzify', () => {
  it('takes a search string and wrap it in MySQL fuzzy delimiters `%`', () => {
    expect(fuzzify('foo bar')).toBe('%foo bar%');
  });
});
