'use strict';

const R      = require('ramda'),
      mysql  = require('mysql'),
      config = require('config'),
      dbPool = mysql.createPool(R.path(['db', 'mysql', 'poolConfig'], config));

const DB = require('@businesswire/bw-node-mysql-connector')(dbPool);

const getDbNameForQuery = service => '`' + process.env[service.toUpperCase() + '_DB_NAME'] + '`';

// DB.otherDbName = getDbNameForQuery('other');
DB.coreDbName = getDbNameForQuery('core');

module.exports = DB;
