'use strict';

const R = require('ramda');

const { errors } = require('@businesswire/bw-node-error');

const config = {
  serviceName : R.pathOr('platform', ['env', 'THIS_SERVICE_NAME'], process),
  server      : {
    host          : R.pathOr('localhost', ['env', 'HOST'], process),
    nodePorts     : R.compose(
      R.map(R.partialRight(parseInt, [10])),
      R.split(','),
      R.concat('')
    )(R.pathOr('1343,1344,1345', ['env', 'NODE_PORTS'], process)),
    corsWhitelist : {
      patternString : process.env.CORS_WHITELIST_PATTERN,
      flags         : 'i'
    }
  },

  logger : {
    pino : {
      level : R.pathOr('debug', ['env', 'LOG_LEVEL'], process)
    }
  },


  session : {
    secret : R.pathOr('secret', ['env', 'SESSION_SECRET'], process)
  },

  db : {
    mysql : {
      poolConfig                       : {
        connectionLimit : R.pathOr(30, ['env', 'CORE_DB_CONNECTION_LIMIT'], process),
        host            : R.pathOr('localhost', ['env', 'CORE_DB_HOST'], process),
        port            : R.pathOr(3306, ['env', 'CORE_DB_PORT'], process),
        user            : R.pathOr('root', ['env', 'CORE_DB_USER'], process),
        password        : R.pathOr('root', ['env', 'CORE_DB_PASSWORD'], process)
      },
      searchableFields                 : {},
      DYNAMICALLY_POPULATED_DB_COLUMNS : ['timestamp']
    }
  },

  DATA_STATUS_CONSTANTS : {
    PUBLISHED       : 1,
    FLAGGED_BY_USER : 2,
    SOFT_DELETED    : 3,
    EDITED_TEXT     : 4
  },

  errors : {
    ...errors,
    decorateForJson : ({ statusCode=501, ...err }) => ({ err, statusCode })
  },

  api : {
    COMMON_PRIVATE_FIELDS            : [],
    ORDER_PRIVATE_FIELDS             : [],
    COMMON_SQL_RETURNABLE_PROPERTIES : [
      'affectedRows',
      'warningCount',
      'message',
      'changedRows'
    ]
  },

  order : {
    strategy   : R.pathOr('mockLocal', ['env', 'ORDER_SERVICE_STRATEGY'], process),
    apiRoot    : R.pathOr('', ['env', 'ORDER_SERVICE_API_ROOT'], process),
    headerAuth : R.pathOr('', ['env', 'ORDER_SERVICE_API_HEADER_AUTHORIZATION'], process)
  },

  auth : {
    strategy : 'jwt'
  }
};

module.exports = config;

// eslint-disable-next-line no-console
console.log('USING DEFAULT CONFIG');
