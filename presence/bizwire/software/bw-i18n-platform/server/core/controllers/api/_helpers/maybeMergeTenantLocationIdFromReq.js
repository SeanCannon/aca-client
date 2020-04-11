'use strict';

const R = require('ramda');

const fromReq = R.compose(R.assoc('tenantOrganizationId'), R.path(['tenantOrganization', 'id']));

module.exports = R.curry((req, data) => R.unless(R.prop('tenantOrganizationId'),fromReq(req))(data));
