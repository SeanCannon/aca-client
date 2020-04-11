'use strict';

const EXPECT_SINGLE_RETURN_ITEM = true,
      ALLOW_EMPTY_RESPONSE      = true,
      CONNECTION                = null;

const _connectionHandle = require('./_connectionHandle');

/**
 * Execute a query, expecting a single item returned.
 */
module.exports = require('./_transaction')(_connectionHandle, CONNECTION, EXPECT_SINGLE_RETURN_ITEM, ALLOW_EMPTY_RESPONSE);
