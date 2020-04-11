'use strict';

const cuid       = require('cuid'),
      { errors } = require('../../../constants');

const TWO_HOURS_IN_SECONDS_CACHE_EXPIRE = 1000 * 60 * 60 * 2;

const generateAndCacheRefreshToken = cache => ({ payload, secret, expires = TWO_HOURS_IN_SECONDS_CACHE_EXPIRE }) => {

  const refreshToken           = cuid(),
        refreshTokenLookupKey  = `refreshToken:${refreshToken}`,
        refreshTokenLookupData = { payload, secret };

  if (!payload) {
    throw errors.MISSING_REFRESH_TOKEN_PAYLOAD;
  }

  if (!secret) {
    throw errors.MISSING_REFRESH_TOKEN_SECRET;
  }

  cache.setKey(refreshTokenLookupKey, refreshTokenLookupData);
  cache.save();

  /* istanbul ignore next line */
  setTimeout(() => cache.removeKey(refreshTokenLookupKey), expires);

  return refreshToken;
};

module.exports = generateAndCacheRefreshToken;
