'use strict';

const R = require('ramda');

const transformQueryResponse   = require('./transformQueryResponse'),
      ensureNotSingleItemArray = require('./ensureNotSingleItemArray'),
      constants                = require('../constants');

const isNilOrEmpty = R.either(R.isNil, R.isEmpty);

const maybeRollbackAndRelease = (connection, transaction) => {
  if (transaction) {
    connection.rollback();
  }
  connection.release();
};

const maybeEnsureSingleItemArray = singleReturnItem => data => singleReturnItem ? ensureNotSingleItemArray(data) : data;

const _queryCallback = (deferred, connection, transaction, singleReturnItem, allowEmptyResponse) => (err, data) => {

  if (err) {
    switch (R.prop('code', err)) {
      case 'ER_DUP_ENTRY' :
        maybeRollbackAndRelease(connection, transaction);
        deferred.reject(constants.errors.DUPLICATE(R.prop('message', err)));
        break;
      default :
        maybeRollbackAndRelease(connection, transaction);
        deferred.reject(constants.errors.UNKNOWN(R.prop('message', err)));
        break;
    }
    return deferred.promise;

  } else {

    if (isNilOrEmpty(data)) {

      if (allowEmptyResponse) {
        if (!transaction) {
          connection.release();
        }

        deferred.resolve(singleReturnItem ? undefined : []);
      } else {
        connection.release();
        deferred.reject(constants.errors.NO_QUERY_RESULTS);
      }

      return deferred.promise;

    } else {
      const transformedData = R.compose(transformQueryResponse, maybeEnsureSingleItemArray(singleReturnItem))(data);

      if (!transaction) {
        connection.release();
      }

      deferred.resolve(transaction ? { data : transformedData, connection } : transformedData);

      return deferred.promise;
    }
  }
};

module.exports = _queryCallback;
