'use strict';

const R = require('ramda');

const getRootUrlFromReq = req => {
  const host = req.headers ? (req.headers.host || req.headers.hostname || 'localhost') : 'localhost';
  return 'https://' + host + '/';
};

const isCustomHeader = (v, k) => R.test(/^x-/i, k);

const extractCustomHeadersFromObject = R.pickBy(isCustomHeader);

module.exports = {
  getRootUrlFromReq,
  extractCustomHeadersFromObject
};
