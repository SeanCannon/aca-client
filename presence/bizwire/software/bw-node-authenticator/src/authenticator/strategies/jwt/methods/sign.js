'use strict';

const { errors } = require('../../../constants');

const sign = jwt => (payload, secret, options) => new Promise((resolve, reject) => {
  jwt.sign(payload, secret, options, (err, token) => {
    return err ? reject(errors.CANNOT_SIGN_TOKEN) : resolve(token);
  });
});

module.exports = sign;
