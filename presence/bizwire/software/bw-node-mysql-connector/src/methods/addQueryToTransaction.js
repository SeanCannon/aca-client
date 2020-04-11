'use strict';

const R = require('ramda');

const _transaction      = require('./_transaction'),
      _connectionHandle = require('./_connectionHandle');

const EXPECT_SINGLE_RETURN_ITEM = false,
      ALLOW_EMPTY_RESPONSE      = true,
      DB_POOL                   = null;

/**
 * Execute a query on a transaction, expecting the connection returned.
 */
/* istanbul ignore next */
module.exports = R.curry((connection, queryStatement) => _transaction(
  _connectionHandle,
  connection,
  EXPECT_SINGLE_RETURN_ITEM,
  ALLOW_EMPTY_RESPONSE,
  DB_POOL,
  queryStatement
));
