'use strict';

const commit = require('../../../../server/core/utils/db/methods/commit');

const FAKE_ERROR = 'fake error';

const FAKE_CONNECTION_GOOD = {
  commit  : cb => cb(),
  release : () => {}
};

const FAKE_CONNECTION_BAD = {
  commit   : cb => cb(FAKE_ERROR),
  rollback : () => {},
  release  : () => {}
};

describe('commit', () => {

  it('takes a connection, invokes the commit method, and resolves the connection if successful', (done) => {
    commit(FAKE_CONNECTION_GOOD)
      .then(res => {
        expect(res).toBe(true);
        done();
      });
  });

  it('takes a connection, invokes the commit method, and rejects the promise if there is an error', (done) => {
    commit(FAKE_CONNECTION_BAD)
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });

});
