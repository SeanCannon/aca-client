'use strict';

const Q = require('q');

module.exports = connection => {
  const deferred = Q.defer();

  connection.commit(err => {
    if (err) {
      connection.rollback();
      connection.release();
      deferred.reject(err);
    } else {
      connection.release();
      deferred.resolve(true);
    }
  });

  return deferred.promise;
};
