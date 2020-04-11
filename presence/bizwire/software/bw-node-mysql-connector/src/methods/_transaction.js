'use strict';

const R = require('ramda'),
      Q = require('q');

const _transaction = R.curry((connectionHandle, connection, singleReturnItem, allowEmptyResponse, dbPool, queryStatement) => {
  const deferred    = Q.defer(),
        transaction = !!connection,
        cb          = connectionHandle(deferred, queryStatement, transaction, singleReturnItem, allowEmptyResponse);

  connection ? cb(null, connection) : dbPool.getConnection(cb);

  return deferred.promise;
});

module.exports = _transaction;
