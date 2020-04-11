'use strict';

const ensureNotSingleItemArray = require('../../../../server/core/utils/db/methods/ensureNotSingleItemArray');

const FAKE_MULTI_ITEM_ARRAY  = ['foo', 'bar'],
      FAKE_SINGLE_ITEM_ARRAY = ['foo'];

describe('ensureNotSingleItemArray', () => {

  it('returns the given array if it contains two or more items', () => {
    expect(ensureNotSingleItemArray(FAKE_MULTI_ITEM_ARRAY)).toBe(FAKE_MULTI_ITEM_ARRAY);
  });

  it('returns the first item in a given array if the array contains only one item', () => {
    expect(ensureNotSingleItemArray(FAKE_SINGLE_ITEM_ARRAY)).toBe('foo');
  });

});
