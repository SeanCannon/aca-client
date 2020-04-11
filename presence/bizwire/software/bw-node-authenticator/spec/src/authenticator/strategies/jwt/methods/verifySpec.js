'use strict';

const { errors } = require('../../../../../src/constants');

const verify = require('../../../../../src/authenticator/strategies/jwt/methods/verify');

const FAKE_SECRET  = 'fakesecret',
      FAKE_DECODED = { id : 1234 },
      FAKE_OPTIONS = { foo : 'bar' },
      FAKE_TOKEN   = 'faketoken';

const KNOWN_TOKEN_EXPIRED_ERROR = { name : 'TokenExpiredError' },
      KNOWN_TOKEN_INVALID_ERROR = { name : 'JsonWebTokenError' };

const FAKE_JWT_LIB_RESOLVES = {
  verify : (signed, secret, options, cb) => {

    expect(signed).toBe(FAKE_TOKEN);
    expect(secret).toBe(FAKE_SECRET);
    expect(options).toBe(FAKE_OPTIONS);

    cb(null, FAKE_DECODED);
  }
};

const FAKE_JWT_LIB_REJECTS_EXPIRED = {
  verify : (signed, secret, options, cb) => {

    expect(signed).toBe(FAKE_TOKEN);
    expect(secret).toBe(FAKE_SECRET);
    expect(options).toBe(FAKE_OPTIONS);

    cb(KNOWN_TOKEN_EXPIRED_ERROR);
  }
};

const FAKE_JWT_LIB_REJECTS_INVALID = {
  verify : (signed, secret, options, cb) => {

    expect(signed).toBe(FAKE_TOKEN);
    expect(secret).toBe(FAKE_SECRET);
    expect(options).toBe(FAKE_OPTIONS);

    cb(KNOWN_TOKEN_INVALID_ERROR);
  }
};

describe('Auth service verify', () => {

  beforeEach(() => {
    spyOn(FAKE_JWT_LIB_RESOLVES, 'verify').and.callThrough();
    spyOn(FAKE_JWT_LIB_REJECTS_EXPIRED, 'verify').and.callThrough();
    spyOn(FAKE_JWT_LIB_REJECTS_INVALID, 'verify').and.callThrough();
  });

  it('resolves a decoded token payload if signed token and secret match', done => {
    verify(FAKE_JWT_LIB_RESOLVES)(FAKE_TOKEN, FAKE_SECRET, FAKE_OPTIONS)
      .then(decoded => {
        expect(decoded).toBe(FAKE_DECODED);
        expect(FAKE_JWT_LIB_RESOLVES.verify).toHaveBeenCalledWith(FAKE_TOKEN, FAKE_SECRET, FAKE_OPTIONS, jasmine.any(Function));
        done();
      });
  });

  it('rejects if provided token is expired', done => {
    verify(FAKE_JWT_LIB_REJECTS_EXPIRED)(FAKE_TOKEN, FAKE_SECRET, FAKE_OPTIONS)
      .catch(err => {
        expect(err).toBe(errors.TOKEN_EXPIRED);
        expect(FAKE_JWT_LIB_REJECTS_EXPIRED.verify).toHaveBeenCalledWith(FAKE_TOKEN, FAKE_SECRET, FAKE_OPTIONS, jasmine.any(Function));
        done();
      });
  });

  it('rejects if provided token is invalid', done => {
    verify(FAKE_JWT_LIB_REJECTS_INVALID)(FAKE_TOKEN, FAKE_SECRET, FAKE_OPTIONS)
      .catch(err => {
        expect(err).toBe(errors.TOKEN_INVALID);
        expect(FAKE_JWT_LIB_REJECTS_INVALID.verify).toHaveBeenCalledWith(FAKE_TOKEN, FAKE_SECRET, FAKE_OPTIONS, jasmine.any(Function));
        done();
      });
  });
});
