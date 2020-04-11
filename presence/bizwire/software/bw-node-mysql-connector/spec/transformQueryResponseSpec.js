'use strict';

const R = require('ramda');

const transformQueryResponse = require('../../../../server/core/utils/db/methods/transformQueryResponse');

const fakeRecordBefore = {
  first_name : 'John',
  last_name  : 'Doe'
};

const fakeRecordAfter = {
  firstName : 'John',
  lastName  : 'Doe'
};

const makeFakeRecord = () => {
  return R.merge(fakeRecordBefore, {});
};

const fakeQueryResponse  = [makeFakeRecord(), makeFakeRecord()],
      fakeLookupResponse = makeFakeRecord();

describe('transformQueryResponse', () => {

  it('transforms all strings from the case used ' +
    'for MySQL fields to the case used for JS variables ' +
    'in a given object', () => {
    expect(transformQueryResponse(fakeLookupResponse))
      .toEqual(fakeRecordAfter);
  });

  it('transforms all strings from the case used ' +
    'for MySQL fields to the case used for JS variables ' +
    'in a given array of objects', () => {
    expect(transformQueryResponse(fakeQueryResponse))
      .toEqual([fakeRecordAfter, fakeRecordAfter]);
  });

});
