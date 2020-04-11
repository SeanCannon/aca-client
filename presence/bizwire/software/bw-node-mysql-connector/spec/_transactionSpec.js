'use strict';

const _transaction = require('../../../../server/core/utils/db/methods/_transaction');

const cbSpy = {
  cb : (a, b) => {
  }
};

const FAKE_CONNECTION           = jasmine.createSpyObj('connection', ['release', 'rollback', 'query']),
      FAKE_DBPOOL               = jasmine.createSpyObj('dbpool', ['getConnection']),
      FAKE_CONNECTION_HANDLE    = (deferred, queryStatement, transaction, singleReturnItem, allowEmptyResponse) => cbSpy.cb,
      FAKE_QUERY_STATEMENT      = '',
      FAKE_SINGLE_RETURN_ITEM   = false,
      FAKE_ALLOW_EMPTY_RESPONSE = false;

describe('transaction', () => {

  beforeEach(() => {
    spyOn(cbSpy, 'cb');
  });

  it('invokes callback when connection is provided', done => {
    _transaction(
      FAKE_CONNECTION_HANDLE,
      FAKE_CONNECTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE,
      FAKE_DBPOOL,
      FAKE_QUERY_STATEMENT
    );

    setTimeout(() => {
      expect(cbSpy.cb).toHaveBeenCalledWith(null, FAKE_CONNECTION);
      done();
    }, 1);
  });

});

