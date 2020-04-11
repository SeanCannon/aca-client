'use strict';

const config = require('config'),
      R      = require('ramda');

const _getLegacyUserByUsername = axios => loginRequest => {
  return axios.post(R.concat(config.legacyUser.apiRoot, 'auth'), loginRequest, {
    headers : {
      'Authorization' : config.legacyUser.headerAuth,
      'Content-Type'  : 'application/json'
    }
  }).then(R.prop('data'))
    .catch(R.path(['response', 'data']));
};

module.exports = _getLegacyUserByUsername;
