'use strict';

const path      = require('path'),
      cachePath = path.resolve(__dirname, process.env.BW_NODE_AUTHENTICATOR_RELATIVE_CACHE_PATH || '/tmp'),
      flatCache = require('flat-cache'),
      cache     = flatCache.load('bwc5', cachePath),
      jwt       = require('jsonwebtoken');

module.exports = {
  identifyCaller               : require('./methods/identifyCaller'),
  generateAndCacheRefreshToken : require('./methods/generateAndCacheRefreshToken')(cache),
  lookupRefreshToken           : require('./methods/lookupRefreshToken')(cache),
  sign                         : require('./methods/sign')(jwt),
  verify                       : require('./methods/verify')(jwt),
  urlBase64Encode              : require('./methods/urlBase64Encode'),
  urlBase64Decode              : require('./methods/urlBase64Decode')
};
