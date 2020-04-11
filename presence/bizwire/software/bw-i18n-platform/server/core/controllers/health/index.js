'use strict';

require('dotenv-safe').load();

const mysql = require('./services/mysql');

const report = service => ([reports, { err }]) => reports.concat([{ service, err }]);

module.exports = () => Promise.resolve([])
  .then(mysql)
  .then(report('MySQL'));
