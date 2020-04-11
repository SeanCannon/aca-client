'use strict';

const { errors } = require('../../../constants'),
      { is }     = require('../../../helpers');

const maybeRejectIfTokenExpired = (reject, err) => {
  if (is(Object)(err) && err.name === 'TokenExpiredError') {
    reject(errors.TOKEN_EXPIRED);
  }
};

const maybeRejectIfTokenInvalid = (reject, err) => {
  if (is(Object)(err) && err.name === 'JsonWebTokenError') {
    reject(errors.TOKEN_INVALID);
  }
};

const verify = jwt => (signed, secret, options) => new Promise((resolve, reject) => {
  jwt.verify(signed, secret, options, (err, decoded) => {
    maybeRejectIfTokenExpired(reject, err);
    maybeRejectIfTokenInvalid(reject, err);
    resolve(decoded);
  });
});

module.exports = verify;
