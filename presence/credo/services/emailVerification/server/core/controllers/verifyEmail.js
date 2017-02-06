'use strict';

const Q        = require('q'),
      R        = require('ramda'),
      config   = require('config'),
      validate = require('../validation/validateData');

const checkResponseStatus = (response) => {
  if (!response.ok) {
    throw new Error('Email verification service API response error');
  }
  return response;
};

const logResponse = (credoSdk) => (res) => {
  return res.clone().text()
    .then(text => {
      credoSdk.service.logger.info(
        R.merge(R.pick(['headers', 'status', 'statusText', 'type', 'url'], res), {body : text})
      );
      return res;
    });
};

const remotelyVerifyEmail = (credoSdk, fetch) => ({zipCode, carrierId}) => {
  const url = carrierId ?
    `${config.credoPlutoCoverageApi.url}/${zipCode}/${carrierId}`
    : `${config.credoPlutoCoverageApi.url}/${zipCode}`;

  credoSdk.service.logger.info({url});

  return fetch(url, {
    headers : config.credoPlutoCoverageApi.headers
  })
    .then(logResponse(credoSdk))
    .then(checkResponseStatus)
    .then(res => res.json())
    .then(V.validateOrThrow(schemas.coverageCheckResponse))
    .then((json) => {
      return json;
    });
};

/**
 * Checks email address
 * @param {Function} fetch
 * @param {String} email
 */
const verifyEmail = (credoSdk, fetch, email) => {
  return Q({email})
    .then(V.validateOrThrow(schemas.coverageCheck))
    .then(remotelyVerifyEmail(credoSdk, fetch));
};

module.exports = verifyEmail;
