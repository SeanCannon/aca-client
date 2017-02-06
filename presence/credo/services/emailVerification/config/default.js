'use strict';

const R = require('ramda');

// These values can be overridden by either environment vars or by a NODE_ENV named config
// which declares the desired object of the same name.
const FALLBACK_DEFAULT_VALUES = {
  host         : 'localhost',
  clusterPorts : '3010,3011,3012',
  mainPort     : '3009',
  db           : {
    mysql : {
      authDb : {
        connectionLimit : 30,
        host            : 'localhost',
        user            : 'root',
        password        : 'root'
      }
    }
  },
  redis        : {
    host     : 'localhost',
    port     : 6379,
    password : ''
  }
};

const NODE_HOST     = process.env.HOST || FALLBACK_DEFAULT_VALUES.host;
const CLUSTER_PORTS = process.env.CLUSTER_PORTS || FALLBACK_DEFAULT_VALUES.clusterPorts;
const MAIN_PORT     = process.env.MAIN_PORT || FALLBACK_DEFAULT_VALUES.mainPort;

const COMMON_PRIVATE_FIELDS = ['password'];

const config = {

  credoPlutoCoverageApi : {
    url     : process.env.PLUTO_DOMAIN + '/EmailVerification/api/v1/VerifyEmail',
    headers : {
      'X-Token' : process.env.PLUTO_AUTH_TOKEN
    }
  },

  server : {
    host         : NODE_HOST,
    mainPort     : MAIN_PORT,
    clusterPorts : CLUSTER_PORTS.split(','),
    clusterPaths : CLUSTER_PORTS.split(',').map(port => 'http://' + NODE_HOST + ':' + port)
  },

  DATA_STATUS_CONSTANTS : {
    PUBLISHED       : 1,
    FLAGGED_BY_USER : 2,
    SOFT_DELETED    : 3,
    EDITED_TEXT     : 4
  },

  redis : {
    client   : 'redis',
    host     : R.defaultTo(
      R.path(['redis', 'host'], FALLBACK_DEFAULT_VALUES),
      R.path(['env', 'REDIS_HOST'], process)
    ),
    port     : R.defaultTo(
      R.path(['redis', 'port'], FALLBACK_DEFAULT_VALUES),
      R.path(['env', 'REDIS_PORT'], process)
    ),
    password : R.defaultTo(
      R.path(['redis', 'password'], FALLBACK_DEFAULT_VALUES),
      R.path(['env', 'REDIS_PASSWORD'], process)
    )
  },

  errors : {
    UNAUTHORIZED_API_ACCESS : 5000,
    FLAGGED_ITEM            : 5001,
    TOKEN_EXPIRED           : 5002,
    SERVER_ERROR            : 5003
  },

  auth : {
    SALT_ROUNDS_EXPONENT    : 10,
    IS_ADMIN_ELIGIBLE_EMAIL : R.anyPass([
      R.test(/\S+@credomobile.com/),
      R.test(/\S+@presencepg.com/)
    ])
  },

  api : {
    COMMON_PRIVATE_FIELDS            : COMMON_PRIVATE_FIELDS,
    AGENT_PRIVATE_FIELDS             : R.concat(COMMON_PRIVATE_FIELDS, ['secret', 'key']),
    COMMON_SQL_RETURNABLE_PROPERTIES : [
      'affectedRows',
      'warningCount',
      'message',
      'changedRows'
    ]
  }
};

module.exports = config;

console.log('USING DEFAULT CONFIG');

