'use strict';

const { errors }                           = require('../../../constants'),
      { head, identical, last, defaultTo } = require('../../../helpers');

/**
 * Get a token from a header or from a `token` query string parameter.
 * Function expects header token to be JWT which is prefixed with 'Bearer '.
 * @param {Object} req ExpressJS request object
 * @returns {String}
 */
const identifyCaller = req => {

  if (!req) {
    throw errors.MISSING_REQ;
  }

  const isBearer         = identical('Bearer'),
        headerToken      = req.headers && defaultTo('')(req.headers.authorization),
        headerTokenParts = headerToken.split(' '),
        headerTokenType  = head(headerTokenParts),
        queryToken       = req.query && req.query.token;

  return isBearer(headerTokenType) ? last(headerTokenParts) : defaultTo('')(queryToken);
};

module.exports = identifyCaller;
