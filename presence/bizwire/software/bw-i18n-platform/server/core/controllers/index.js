'use strict';

const R = require('ramda');

const FAILOVER_BUILD_NUM = new Date().getTime();

const index = (req, res) => res.render('layout', {
  ip          : req.header('X-Real-Ip'),
  cacheRev    : R.prop('_cacheRev', process),
  sessionUser : R.defaultTo('', JSON.stringify(R.prop('user', req))),
  buildNum    : R.defaultTo(FAILOVER_BUILD_NUM, R.path(['env', 'BUILD_NUM'], process))
});

module.exports = index;
