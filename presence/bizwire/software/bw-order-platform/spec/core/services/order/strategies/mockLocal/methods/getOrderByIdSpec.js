'use strict';

const path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      R            = require('ramda');

const getLegacyUserByUsername = require('../../../../../../../server/core/services/legacyUser/strategies/mockLocal/methods/getLegacyUserByUsername');
const converter               = new CSVConverter({});

const USER_NOT_FOUND_RESPONSE = { "message" : "Invalid username or password", "statusCode" : 401 };
const LOGIN_REQUEST_TEMPLATE  = { username : 'tempusername', password : 'temppassword' };

let KNOWN_TEST_USER_DATA;
let KNOWN_TEST_USERNAME;
let KNOWN_TEST_PASSWORD;

describe('getLegacyUserByUsername', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, `../../../../../../../run/env/test/seedData/legacyUsers.csv`), (err, _data) => {
      KNOWN_TEST_USER_DATA = R.indexBy(R.prop('username'), _data);
      KNOWN_TEST_USERNAME  = R.compose(R.prop('username'), R.head)(_data);
      KNOWN_TEST_PASSWORD  = R.compose(R.prop('password'), R.head)(_data);
      done();
    });
  });

  it('finds a legacy user by username', done => {
    getLegacyUserByUsername(R.mergeDeepLeft({
      username : KNOWN_TEST_USERNAME,
      password : KNOWN_TEST_PASSWORD
    }, LOGIN_REQUEST_TEMPLATE))
      .then(res => {
        expect(res.connectAccount).toBe(KNOWN_TEST_USER_DATA[KNOWN_TEST_USERNAME].connectAccount);
        done();
      });
  });

  it('fails gracefully if user does not exist', done => {
    getLegacyUserByUsername(LOGIN_REQUEST_TEMPLATE)
      .then(res => {
        expect(res).toEqual(USER_NOT_FOUND_RESPONSE);
        done();
      });
  });

  it('fails gracefully if username is not provided when invoking the api', done => {
    getLegacyUserByUsername({})
      .then(res => {
        expect(res).toEqual(USER_NOT_FOUND_RESPONSE);
        done();
      });
  });

  it('rejects if users cannot be found', done => {
    process.env.NODE_ENV = 'foo';
    getLegacyUserByUsername(R.mergeDeepLeft({
      username : KNOWN_TEST_USERNAME,
      password : KNOWN_TEST_PASSWORD
    }, LOGIN_REQUEST_TEMPLATE))
      .catch(err => {
        expect(err.message).toBe(path.resolve(__dirname, `../../../../../../../run/env/foo/seedData/legacyUsers.csv`) + ' cannot be found.');
        process.env.NODE_ENV = 'test';
        done();
      });
  });
});


