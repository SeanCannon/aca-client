'use strict';

const R = require('ramda');

/**
 * Middleware adds a `sortName` property to req.query
 * Do NOT use a lens here with R.set or req will lose reference.
 * @param {String} sortName The name of the export in /controllers/api/_sorters
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
const addSortNameQuery = R.curry((sortName, req, res, next) => {
  req.query          = req.query || {};
  req.query.sortName = sortName;
  next();
});

module.exports = addSortNameQuery;
