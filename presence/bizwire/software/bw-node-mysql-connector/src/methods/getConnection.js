'use strict';

const Q = require('q');

const constants = require('../constants');

const getConnection = dbPool => () => {
  const deferred = Q.defer();

  try {

    dbPool.getConnection((err, connection) => {
      if (err) {
        deferred.reject(err);
      } else {
        if (connection) {
          deferred.resolve(connection);
        } else {
          deferred.reject(constants.errors.MISSING_CONNECTION);
        }
      }
    });

  } catch(err) {
    deferred.reject(err);
  }

  return deferred.promise;
};

module.exports = getConnection;
