'use strict';

const getConnection = require('./getConnection');

module.exports = dbPool => () => new Promise((resolve, reject) => {
  getConnection(dbPool)()
    .then(connection => {
      connection.beginTransaction(err => {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    })
    .catch(err => {
      reject(err);
    });
});

