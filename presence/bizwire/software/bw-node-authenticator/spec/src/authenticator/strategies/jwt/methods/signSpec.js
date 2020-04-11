'use strict';

const { errors } = require('../../../../../src/constants');

const sign = require('../../../../../src/authenticator/strategies/jwt/methods/sign');

const FAKE_PAYLOAD = 'fakepayload',
      FAKE_SECRET  = 'fakesecret',
      FAKE_OPTIONS = { foo : 'bar' },
      FAKE_TOKEN   = 'faketoken';

const FAKE_ERROR = new Error('fakeerror');

const FAKE_JWT_LIB_RESOLVES = {
  sign : (payload, secret, options, cb) => {

    expect(payload).toBe(FAKE_PAYLOAD);
    expect(secret).toBe(FAKE_SECRET);
    expect(options).toBe(FAKE_OPTIONS);

    cb(null, FAKE_TOKEN);
  }
};

const FAKE_JWT_LIB_REJECTS = {
  sign : (payload, secret, options, cb) => {

    expect(payload).toBe(FAKE_PAYLOAD);
    expect(secret).toBe(FAKE_SECRET);
    expect(options).toBe(FAKE_OPTIONS);

    cb(FAKE_ERROR);
  }
};

describe('Auth service sign', () => {

  beforeEach(() => {
    spyOn(FAKE_JWT_LIB_RESOLVES, 'sign').and.callThrough();
    spyOn(FAKE_JWT_LIB_REJECTS,  'sign').and.callThrough();
  });

  it('resolves a token if one can be signed', done => {
    sign(FAKE_JWT_LIB_RESOLVES)(FAKE_PAYLOAD, FAKE_SECRET, FAKE_OPTIONS)
      .then(token => {
        expect(token).toBe(FAKE_TOKEN);
        expect(FAKE_JWT_LIB_RESOLVES.sign).toHaveBeenCalledWith(FAKE_PAYLOAD, FAKE_SECRET, FAKE_OPTIONS, jasmine.any(Function));
        done();
      });
  });

  it('rejects if no token can be signed', done => {
    sign(FAKE_JWT_LIB_REJECTS)(FAKE_PAYLOAD, FAKE_SECRET, FAKE_OPTIONS)
      .catch(err => {
        expect(err).toBe(errors.CANNOT_SIGN_TOKEN);
        expect(FAKE_JWT_LIB_REJECTS.sign).toHaveBeenCalledWith(FAKE_PAYLOAD, FAKE_SECRET, FAKE_OPTIONS, jasmine.any(Function));
        done();
      });
  });
});
