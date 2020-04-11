'use strict';

const R = require('ramda');

const FAILOVER_BUILD_NUM = new Date().getTime();

const healthCheck = require('../controllers/health');

const health = (req, res) => {
  const ip       = req.header('X-Real-Ip'),
        cacheRev = R.prop('_cacheRev', process),
        buildNum = R.defaultTo(FAILOVER_BUILD_NUM, R.path(['env', 'BUILD_NUM'], process));

  const renderReports = res => reports => res.render('health', { reports, ip, cacheRev, buildNum });

  healthCheck()
    .then(renderReports(res))
    .catch(err => {
      req.logger.child({ ip, cacheRev, buildNum }).error('Health Check Error: ', err);
      renderReports(res)([]);
    });
};

module.exports = health;
