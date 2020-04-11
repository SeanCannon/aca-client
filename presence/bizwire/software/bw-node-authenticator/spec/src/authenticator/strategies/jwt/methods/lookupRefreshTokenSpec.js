'use strict';

const lookupRefreshToken = require('../../../../../src/authenticator/strategies/jwt/methods/lookupRefreshToken');

describe('authenticator lookupRefreshToken', () => {
  it('attempts to get a token from the cache', done => {
    const FAKE_CACHE_UTILS   = jasmine.createSpyObj('cacheUtils', ['getKey']),
          FAKE_REFRESH_TOKEN = 'foo';

    lookupRefreshToken(FAKE_CACHE_UTILS)(FAKE_REFRESH_TOKEN);

    setTimeout(() => {
      expect(FAKE_CACHE_UTILS.getKey).toHaveBeenCalledWith(`refreshToken:${FAKE_REFRESH_TOKEN}`);
      done();
    }, 1);

  });
});
