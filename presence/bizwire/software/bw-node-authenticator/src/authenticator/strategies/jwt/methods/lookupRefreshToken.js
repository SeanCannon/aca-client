'use strict';

const lookupRefreshToken = cache => refreshToken => cache.getKey(`refreshToken:${refreshToken}`);

module.exports = lookupRefreshToken;
