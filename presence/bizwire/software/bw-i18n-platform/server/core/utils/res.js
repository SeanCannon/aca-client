'use strict';

const R = require('ramda');

const { errors } = require('@businesswire/bw-node-error');

const serializeError = require('serialize-error');

const scrubErrorForBrowser = (err, req) => {
  let responseError;

  const shouldSeeFullError = R.pathEq(['user', 'strategy'], 'service')(req) || process.env.ALLOW_DEBUG === 'true';
  const scrubForBrowser    = R.omit(['debug', 'stack']);

  if (err.isBwError) {
    if (shouldSeeFullError) {
      responseError = err;
    } else {
      responseError = scrubForBrowser(err);
    }
  } else {
    if (shouldSeeFullError) {
      responseError = errors.system.UNCAUGHT({
        debug : {
          originalError : err
        }
      });
    } else {
      responseError = scrubForBrowser(errors.system.UNCAUGHT());
    }
  }

  return serializeError(responseError);
};


module.exports = {
  scrubErrorForBrowser
};
