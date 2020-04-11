'use strict';

const beginTransaction = require('../../../../server/core/utils/db/methods/beginTransaction');

const constants = require('../../../../server/core/utils/db/constants');

const FAKE_ERROR = new Error('fake error');

const FAKE_CONNECTION_GOOD = {
  beginTransaction : cb => cb(null, { query : 'cool' })
};

const FAKE_CONNECTION_BAD = {
  beginTransaction : cb => cb(FAKE_ERROR)
};

const FAKE_DB_POOL_GOOD = {
  getConnection : cb => cb(null, FAKE_CONNECTION_GOOD)
};

const FAKE_DB_POOL_BAD = {
  getConnection : cb => cb(FAKE_ERROR)
};

const FAKE_DB_POOL_GOOD_WITH_BAD_CONNECTION = {
  getConnection : cb => cb(null, FAKE_CONNECTION_BAD)
};

const FAKE_DB_POOL_GOOD_WITH_MISSING_CONNECTION = {
  getConnection : cb => cb(null, null)
};

const FAKE_CORRUPTED_DB_POOL_OBJ = {};

describe('beginTransaction', () => {

  it('takes a db pool, gets a connection, invokes the beginTransaction method, and resolves the connection if successful', done => {
    beginTransaction(FAKE_DB_POOL_GOOD)()
      .then(connection => {
        expect(connection).toBe(FAKE_CONNECTION_GOOD);
        done();
      });
  });

  it('takes a db pool, and rejects the promise if there is an error', done => {
    beginTransaction(FAKE_DB_POOL_BAD)()
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });

  it('takes a db pool, gets a connection, invokes the beginTransaction method, and rejects the promise if there is an error', done => {
    beginTransaction(FAKE_DB_POOL_GOOD_WITH_BAD_CONNECTION)()
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });

  it('takes a db pool, gets a connection, invokes the beginTransaction method, and rejects the promise if there is an error', done => {
    beginTransaction(FAKE_DB_POOL_GOOD_WITH_MISSING_CONNECTION)()
      .catch(err => {
        expect(err).toBe(constants.errors.MISSING_CONNECTION);
        done();
      });
  });

  it('takes a db pool, and rejects the promise if there are any thrown exceptions', done => {
    beginTransaction(FAKE_CORRUPTED_DB_POOL_OBJ)()
      .catch(err => {
        expect(err.message).toBe('dbPool.getConnection is not a function');
        done();
      });
  });

});
