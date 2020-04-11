'use strict';

const { errors } = require('../../../../../src/constants');

const identifyCaller = require('../../../../../src/authenticator/strategies/jwt/methods/identifyCaller');

const FAKE_REQ_TOKEN_IN_HEADERS = {
  headers : {
    authorization : 'Bearer foo'
  }
};

const FAKE_REQ_TOKEN_IN_QUERY_STRING = {
  query : {
    token : 'foo'
  }
};

describe('authenticator identifyCaller', () => {

  it('gets the token out of the authorization header', () => {
    const token = identifyCaller(FAKE_REQ_TOKEN_IN_HEADERS);
    expect(token).toBe('foo');
  });

  it('gets the token out of the query string', () => {
    const token = identifyCaller(FAKE_REQ_TOKEN_IN_QUERY_STRING);
    expect(token).toBe('foo');
  });

  it('throws an error when missing the req object', () => {
    expect(() => {
      identifyCaller();
    }).toThrow(errors.MISSING_REQ);
  });

});
