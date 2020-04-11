'use strict';
const config            = require('config');
const _connectionHandle = require('../../../../server/core/utils/db/methods/_connectionHandle');

const NO_DB_CONNECTION_ERROR = config.errors.db.NO_DB_CONNECTION;

const FAKE_DEFERRED             = jasmine.createSpyObj('deferred', ['reject']),
      FAKE_CONNECTION           = jasmine.createSpyObj('connection', ['release', 'rollback', 'query']),
      FAKE_QUERY_STATEMENT      = '',
      FAKE_TRANSACTION          = {},
      FAKE_TRANSACTION_MISSING  = undefined,
      FAKE_SINGLE_RETURN_ITEM   = false,
      FAKE_ALLOW_EMPTY_RESPONSE = false,
      FAKE_ERROR                = {};


describe('connectionHandle', () => {
  it('rejects when connection is missing', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ERROR);
    setTimeout(() => {
      expect(FAKE_DEFERRED.reject).toHaveBeenCalledWith(NO_DB_CONNECTION_ERROR);
      done();
    }, 1);
  });

  it('rolls back transaction when there is an error', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ERROR, FAKE_CONNECTION);
    setTimeout(() => {
      expect(FAKE_CONNECTION.rollback).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('releases the connection when there is an error with no transaction', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION_MISSING,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ERROR, FAKE_CONNECTION);
    setTimeout(() => {
      expect(FAKE_CONNECTION.release).toHaveBeenCalled();
      done();
    }, 1);
  });
});