'use strict';

const path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      R            = require('ramda');

const USER_NOT_FOUND_RESPONSE = {
  message    : 'Invalid username or password',
  statusCode : 401
};

const getLegacyUserByUsername = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    if (!username || !password) {
      resolve(USER_NOT_FOUND_RESPONSE);
    } else {
      const converter = new CSVConverter({});
      converter.fromFile(path.resolve(__dirname, `../../../../../../../run/env/${process.env.NODE_ENV}/seedData/legacyUsers.csv`), (err, _data) => {
        if (err) {
          reject(err);
        } else {
          const checkmfa  = R.ifElse(
            R.propEq('requireMfa', true),
            R.compose(R.assoc('statusCode', 401), R.assoc('message', 'User needs MFA for log in')),
            R.assoc('statusCode', 200)
          );
          const setStatus = R.unless(
            R.isNil,
            checkmfa
          );

          resolve(
            R.compose(
              R.defaultTo(USER_NOT_FOUND_RESPONSE),
              setStatus,
              R.find(R.propEq('username', username))
            )(_data)
          );
        }
      });
    }
  });
};

module.exports = getLegacyUserByUsername;
