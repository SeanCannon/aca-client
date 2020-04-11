'use strict';

const R = require('ramda');

/**
 * Accept a path to a value. If the value is undefined,
 * we return that, otherwise we pass to parseInt. This allows
 * for a clear fork of illegalParamError and missingParamError.
 * @param {Array}  path
 * @param {Object} obj
 * @returns {Number|undefined}
 */
const maybeParseIntFromPath = R.curry((path, obj) => {
  let item = R.compose(R.defaultTo(undefined), R.path(path))(obj);
  if (!R.isNil(item)) {
    item = parseInt(item, 10);
  }
  return item;
});

module.exports = maybeParseIntFromPath;
