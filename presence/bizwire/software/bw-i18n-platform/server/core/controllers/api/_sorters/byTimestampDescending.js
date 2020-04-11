'use strict';

const R = require('ramda');

module.exports = R.compose(R.reverse, R.sortBy(R.prop('timestamp')));
