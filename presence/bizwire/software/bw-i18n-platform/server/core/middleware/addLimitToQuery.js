'use strict';

const R = require('ramda');

/**
 * Middleware adds a `limitTo` property to req.query
 * Do NOT use a lens here with R.set or req will lose reference.
 * @param {Number} limitTo
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const addLimitToQuery = R.curry((limitTo, req, res, next) => {
  req.query         = req.query || {};
  req.query.limitTo = limitTo;
  next();
});

module.exports = addLimitToQuery;
