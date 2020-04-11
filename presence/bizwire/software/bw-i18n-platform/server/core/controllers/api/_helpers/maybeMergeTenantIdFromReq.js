'use strict';

const R = require('ramda');

const fromReq = R.compose(R.assoc('tenantId'), R.path(['tenant', 'id']));

module.exports = R.curry((req, data) => R.unless(R.prop('tenantId'), fromReq(req))(data));
