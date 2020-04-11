'use strict';

const R      = require('ramda'),
      config = require('config');

const EXPOSE_HEADERS = [
  'Strict-Transport-Security',
  'X-Frame-Options',
  'X-XSS-Protection',
  'X-Content-Type-Options',
  'X-Permitted-Cross-Domain-Policies',
  'X-Auth-Token',
  'X-Refresh-Token',
  'X-profile',
  'X-RequestID',
  'X-Content-Type-Options'
].join(',');

const allowCors = (req, res, next) => {
  const origin = req.headers.origin;

  if (R.test(new RegExp(config.server.corsWhitelist.patternString, config.server.corsWhitelist.flags), origin)) {
    res.set('Access-Control-Allow-Origin',   origin);
    res.set('Access-Control-Allow-Methods',  'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Expose-Headers', EXPOSE_HEADERS);
    res.set('Access-Control-Allow-Headers',  req.get('Access-Control-Request-Headers'));
  }

  next();
};

module.exports = allowCors;
