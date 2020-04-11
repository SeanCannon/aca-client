'use strict';

const R = require('ramda');

const { errors } = require('../../../../../src/constants');

const generateAndCacheRefreshToken = require('../../../../../src/authenticator/strategies/jwt/methods/generateAndCacheRefreshToken');

const FAKE_PAYLOAD       = { foo : 'bar' },
      FAKE_SECRET        = 'foo',
      FAKE_EXPIRES       = 5000,
      CUID_STRING_LENGTH = 25;

let fakeCacheUtils;

const FAKE_TOKEN_BODY = {
  payload : FAKE_PAYLOAD,
  secret  : FAKE_SECRET,
  expires : FAKE_EXPIRES
};

describe('authenticator generateAndCacheRefreshToken', () => {

  beforeEach(() => {
    fakeCacheUtils = jasmine.createSpyObj('cacheUtils', ['setKey', 'save', 'removeKey']);
  });

  it('generates and caches a refresh token', () => {
    const refreshToken = generateAndCacheRefreshToken(fakeCacheUtils)(FAKE_TOKEN_BODY);

    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.length).toBe(CUID_STRING_LENGTH);

    expect(fakeCacheUtils.setKey).toHaveBeenCalledWith(
      `refreshToken:${refreshToken}`,
      R.omit(['expires'], FAKE_TOKEN_BODY)
    );
  });

  it('generates and caches a refresh token, defaulting to a preset expires value', () => {
    const refreshToken = generateAndCacheRefreshToken(fakeCacheUtils)(
      R.omit(['expires'], FAKE_TOKEN_BODY)
    );

    expect(typeof refreshToken).toBe('string');
    expect(refreshToken.length).toBe(CUID_STRING_LENGTH);

    expect(fakeCacheUtils.setKey).toHaveBeenCalledWith(
      `refreshToken:${refreshToken}`,
      R.omit(['expires'], FAKE_TOKEN_BODY)
    );
  });


  it('throws an error if payload is missing', () => {
    expect(() => {
      generateAndCacheRefreshToken(fakeCacheUtils)(R.omit(['payload'], FAKE_TOKEN_BODY));
    }).toThrow(errors.MISSING_REFRESH_TOKEN_PAYLOAD);
  });

  it('throws an error if secret is missing', () => {
    expect(() => {
      generateAndCacheRefreshToken(fakeCacheUtils)(R.omit(['secret'], FAKE_TOKEN_BODY));
    }).toThrow(errors.MISSING_REFRESH_TOKEN_SECRET);
  });
});
