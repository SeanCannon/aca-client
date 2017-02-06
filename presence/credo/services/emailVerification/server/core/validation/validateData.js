'use strict';

const R        = require('ramda'),
      prr      = require('prettycats'),
      validate = require('credosdk').init({}).util.validate,
      V        = require('o-validator');

const validateEmail = validate('emailData', {
  email : V.required(R.both(prr.isEmail, prr.isStringOfLengthAtMost(100))),
});

const validateVerificationResponse = validate('emailVerificationResponseData', {
  Result : V.required(V.validate({
    IsCovered : V.required(R.is(Boolean))
  }))
});

module.exports = {
  validateEmail,
  validateVerificationResponse
};
