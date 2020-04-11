'use strict';

const R   = require('ramda'),
      jwt = require('jsonwebtoken');

const fakeLogger = {
  child : () => ({
    error : () => {}
  })
};

const ensureAuthorized = require('../../../server/core/middleware/ensureAuthorized');

const FAKE_RESOURCE_REQ_FOR_ROLE_USER_INCLUDES_CLOUD_USER_3 = {
  method             : 'POST',
  baseUrl            : '',
  route              : {
    path : '/auth/login/cnn/antioch'
  },
  tenant             : { id : 2 },
  tenantOrganization : { id : 2 }
};

const FAKE_RESOURCE_REQ_FOR_NON_TENANCY_RESOURCE = {
  method             : 'GET',
  baseUrl            : '',
  route              : {
    path : '/api/v1/document'
  },
  tenant             : {},
  tenantOrganization : {}
};

const _makeFakeReqFromToken = R.compose(
  R.mergeLeft({ logger : fakeLogger }),
  R.mergeDeepRight(FAKE_RESOURCE_REQ_FOR_ROLE_USER_INCLUDES_CLOUD_USER_3),
  R.objOf('headers'),
  R.objOf('authorization'),
  R.concat('Bearer ')
);

const _makeFakeNonResourceReqFromToken = R.compose(
  R.mergeLeft({ logger : fakeLogger }),
  R.mergeDeepRight(FAKE_RESOURCE_REQ_FOR_NON_TENANCY_RESOURCE),
  R.objOf('headers'),
  R.objOf('authorization'),
  R.concat('Bearer ')
);

const KNOWN_TEST_USER_SECRET                                       = '$2a$10$m5n3ZXNWW.vugrJfQmxgYOzLSnE4.mDu1lWXTzMqoCwQ8tUGze1rG',
      KNOWN_TEST_SUPERUSER_SECRET                                  = '$2a$10$vS1pj.R8RNb3yZ4SUNXLV.drrGAA/Uq0fm1nx2ZtN4rU9Zz/z9aEO',
      KNOWN_TEST_AGENT_SECRET                                      = '$2a$04$zvS.d9hNJ.PoX/vr9JFOaOkiyPXb6dOcoSsy58U1jSq40wMgQFwzy',
      KNOWN_TEST_PRIVATE_KEY                                       = process.env.SHARED_PRIVATE_KEY.replace(/\\n/g, '\n'),
      FAKE_UNMAPPED_PRIVATE_KEY                                    = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAlwfO144yZVCmnZ7g6xYwvlr4u8cVYAaoQ31eV1fNEQGswUxr
ByWBPEYMSnf3FN11WVCX+20ItBMzpWhUNZIeD5Hj/6pdN10kCPErKaC/QiAhlke1
GryZ4tM5eYJKVGW4z7gtoulysJqestCkq36IPisvRsy8q4USlO7MKsxuK1z8CUi5
nw0LmsBKC4/vLl5EOtVQFdzbdBDcCCf0hI/UW2/+uAfioLL3rdsbqn5AfjdujcW1
9v+drJoYXiTxzicJ0rJp5mtrp+CQNdIB4wqzMTejvKyVLf1mDlJpCMKvYWklN1eT
Af/V23O/Ksx6TPAM9wVTaz8setWffuuTRtGI3wIDAQABAoIBACF1il540zNc3by3
sQ6D2QKi9s3q+hJPB0IEaT0iZ3zoCRS90ExCA9KNljV9RFDsCw5ha3o5Gp+CTYPM
jDNeDqjWYlOGs6YLTWtpum07foOwyKAZfMbSl6kHsIj502vFKV9jZ0DbRRxY9OWa
kZCotJhJSuz9eKLrFUXHbZXhulqCpPansW8jIO2hGyAXJEZH2Xd3d/BYL8FaUY7I
iJ7eVYCPRxttZirfFdcsHcTSURDamYTPJJi+DBUKRtvzPXGrSJjCLIE6y00vMKjh
yqZXj2YHbwPoxs7JFzg3IK2QQg2+yNYhB6WLQttd5HacnnQcj0+P9fcilmcCzm3b
QcSS2SkCgYEAxpVWwL2Xx3H/RH69ME/LFdbiJ2zPH98YZ8KrkbztZ129jslGRP6O
pLsupApDd4Z6Rz1nW7uyOgnMty52v2uhMy6VUQkRCg6RqK9PIatcx9nMiS9hXkvB
nSdYR3T/qrCS5bxX2cX2WdagcA57IVMKTsoeXaHWob/SyS345B14j10CgYEAwrK4
rxxx7sD0EiLMAPJtK8H3FWjRW9kQc/hKg+dEZ6+FMwBcoFyPsNWL2VgK3PEdeJKr
zZCl1bI92zs+zt7+DJguSKP0lPqlbX4cQ/WyS+/rzKW8Szih6N0h26vmtl56+WB7
jrsqd4v/TdUMKH4jQPNGmtI7dwHe5S+cfNezQWsCgYAIHVYcLiMjnT7nF563eKs9
yzgWkFWuYblnlAbav7Obw7LZQNREQXqmtJdlUJ4NJkuc2Z99mh/gS0I4QgfMLqO5
qa+kThCKLqo5EGDVaWEzMW0wNeVuqv3QZCkxUlCYMvrttFKKrZIxfZm0uoLBi9kh
+xRekxxoI6SDYAOJnsKsaQKBgDoSzPuOZH1umF6AepEdvmp65JRCO5BF4p50xOUr
KkAzHmvkA7zhXwrD537gv/y+/qdkOFKMfqqLC+BEf6t84BIpokSQgvec+5L5Nr0e
oBv+aDsWhF97eO/YZaz8TUjATbXsjW45baVS4Mf6cDHzzdgluD2dz5bju/RoiyjB
vfoZAoGBAKzzs4tRAOLEihpFkLhhQSORwhehnIHCwBlRVY8sFsQSMlXacGvuAjmp
X64i0y64VPbVyoDKs+xNpFJY695W1IRMH24LgL/9/GUpCIMj+oJ56+mX3gm7IQDr
W3uO+Chmk3Kend3vYh7g9izdKYlnU0r+IkK7LO7jHuSDowFgj8+N
-----END RSA PRIVATE KEY-----`,

      FAKE_DECODED_KNOWN_SERVICE                                   = {
        key      : 'lambda',
        strategy : 'service',
        alg      : 'RS256',
        aud      : 'platform'
      },

      FAKE_DECODED_UNKNOWN_SERVICE                                 = {
        key      : 'foo',
        strategy : 'service',
        alg      : 'RS256',
        aud      : 'platform'
      },

      FAKE_DECODED_UNKNOWN_AUDIENCE                                = {
        key      : 'lambda',
        strategy : 'service',
        alg      : 'RS256',
        aud      : 'foo'
      },

      FAKE_DECODED_MISSING_AUDIENCE                                = {
        key      : 'lambda',
        strategy : 'service',
        alg      : 'RS256'
      },

      FAKE_DECODED_KNOWN_AGENT                                     = {
        id       : 2,
        key      : 'ciw59rcxu0000uhp1ygpzzjpr',
        name     : 'Test Agent 1',
        strategy : 'agent',
        status   : 1,
        alg      : 'HS256'
      },

      FAKE_DECODED_UNKNOWN_AGENT                                   = {
        id       : 2,
        key      : 'foo',
        name     : 'Test Agent 1',
        strategy : 'agent',
        status   : 1,
        alg      : 'HS256'
      },

      FAKE_DECODED_KNOWN_SUPERUSER                                 = {
        id        : 1,
        email     : 'platformroot@businesswire.com',
        firstName : 'Root',
        lastName  : 'User',
        strategy  : 'cloudUser',
        status    : 1,
        alg       : 'HS256'
      },

      FAKE_DECODED_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION         = {
        id        : 4,
        email     : 'steven@seagal.com',
        firstName : 'Steven',
        lastName  : 'Seagal',
        strategy  : 'cloudUser',
        status    : 1,
        alg       : 'HS256'
      },

      FAKE_DECODED_KNOWN_USER_WHO_HAS_PERMISSION_FOR_FAKE_RESOURCE = {
        id        : 3,
        email     : 'chuck@norris.com',
        firstName : 'Chuck',
        lastName  : 'Norris',
        strategy  : 'cloudUser',
        status    : 1,
        alg       : 'HS256'
      },

      FAKE_DECODED_UNKNOWN_USER                                    = {
        id        : 3,
        email     : 'foo',
        firstName : 'Chuck',
        lastName  : 'Norris',
        strategy  : 'cloudUser',
        status    : 1,
        alg       : 'HS256'
      },

      FAKE_JWT_INVALID                                             = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaXc1OXJjeHUwMDAwdWhwMXlncHp6anByIiwibmFtZSI6IlRlc3QgQWdlbnQgMSIsInN0YXR1cyI6MSwiZXhwIjo5NjA4MTcyOTEzNn0.XZHI2JLcujFhdpZXJQtQJ8Vq0AO8u5QVlCnJkUnof4',
      FAKE_JWT_EXPIRED_SIGNED_WITH_TEST_AGENT_1_SECRET             = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJjaXc1OXJjeHUwMDAwdWhwMXlncHp6anByIiwibmFtZSI6IlRlc3QgQWdlbnQgMSIsInN0cmF0ZWd5IjoiYWdlbnQiLCJzdGF0dXMiOjEsImFsZyI6IkhTMjU2IiwiZXhwIjoxNDczNzI5NTM4fQ.laKrYj05CcWtB8_8G1ysvaz8Lg87PIj0tB-yusIYvIQ',

      FAKE_JWT_KNOWN_SERVICE                                       = jwt.sign(FAKE_DECODED_KNOWN_SERVICE, KNOWN_TEST_PRIVATE_KEY, { algorithm : 'RS256' }),
      FAKE_JWT_BAD_KEY                                             = jwt.sign(FAKE_DECODED_KNOWN_SERVICE, FAKE_UNMAPPED_PRIVATE_KEY, { algorithm : 'RS256' }),
      FAKE_JWT_UNKNOWN_SERVICE                                     = jwt.sign(FAKE_DECODED_UNKNOWN_SERVICE, KNOWN_TEST_PRIVATE_KEY, { algorithm : 'RS256' }),
      FAKE_JWT_UNKNOWN_AUDIENCE                                    = jwt.sign(FAKE_DECODED_UNKNOWN_AUDIENCE, KNOWN_TEST_PRIVATE_KEY, { algorithm : 'RS256' }),
      FAKE_JWT_MISSING_AUDIENCE                                    = jwt.sign(FAKE_DECODED_MISSING_AUDIENCE, KNOWN_TEST_PRIVATE_KEY, { algorithm : 'RS256' }),
      FAKE_JWT_KNOWN_AGENT                                         = jwt.sign(FAKE_DECODED_KNOWN_AGENT, KNOWN_TEST_AGENT_SECRET, { algorithm : 'HS256' }),
      FAKE_JWT_UNKNOWN_AGENT                                       = jwt.sign(FAKE_DECODED_UNKNOWN_AGENT, KNOWN_TEST_AGENT_SECRET, { algorithm : 'HS256' }),
      FAKE_JWT_KNOWN_USER_WHO_HAS_PERMISSION                       = jwt.sign(FAKE_DECODED_KNOWN_USER_WHO_HAS_PERMISSION_FOR_FAKE_RESOURCE, KNOWN_TEST_USER_SECRET, { algorithm : 'HS256' }),
      FAKE_JWT_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION             = jwt.sign(FAKE_DECODED_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION, KNOWN_TEST_USER_SECRET, { algorithm : 'HS256' }),
      FAKE_JWT_KNOWN_SUPERUSER                                     = jwt.sign(FAKE_DECODED_KNOWN_SUPERUSER, KNOWN_TEST_SUPERUSER_SECRET, { algorithm : 'HS256' }),
      FAKE_JWT_UNKNOWN_USER                                        = jwt.sign(FAKE_DECODED_UNKNOWN_USER, KNOWN_TEST_USER_SECRET, { algorithm : 'HS256' }),

      FAKE_REQ_NO_TOKEN                                            = R.dissocPath(['headers', 'authorization'], _makeFakeReqFromToken(FAKE_JWT_KNOWN_AGENT)),
      FAKE_REQ_NO_METHOD                                           = R.dissoc('method', _makeFakeReqFromToken(FAKE_JWT_KNOWN_AGENT)),

      FAKE_REQ_BAD_KEY                                             = _makeFakeReqFromToken(FAKE_JWT_BAD_KEY),
      FAKE_REQ_KNOWN_SERVICE                                       = _makeFakeReqFromToken(FAKE_JWT_KNOWN_SERVICE),
      FAKE_REQ_UNKNOWN_SERVICE                                     = _makeFakeReqFromToken(FAKE_JWT_UNKNOWN_SERVICE),
      FAKE_REQ_UNKNOWN_AUDIENCE                                    = _makeFakeReqFromToken(FAKE_JWT_UNKNOWN_AUDIENCE),
      FAKE_REQ_MISSING_AUDIENCE                                    = _makeFakeReqFromToken(FAKE_JWT_MISSING_AUDIENCE),
      FAKE_REQ_KNOWN_AGENT                                         = _makeFakeReqFromToken(FAKE_JWT_KNOWN_AGENT),
      FAKE_REQ_UNKNOWN_AGENT                                       = _makeFakeReqFromToken(FAKE_JWT_UNKNOWN_AGENT),
      FAKE_REQ_KNOWN_USER_WHO_HAS_PERMISSION                       = _makeFakeReqFromToken(FAKE_JWT_KNOWN_USER_WHO_HAS_PERMISSION),
      FAKE_REQ_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION             = _makeFakeReqFromToken(FAKE_JWT_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION),
      FAKE_REQ_NON_TENANCY_RESOURCE                                = _makeFakeNonResourceReqFromToken(FAKE_JWT_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION),
      FAKE_REQ_KNOWN_SUPERUSER                                     = _makeFakeReqFromToken(FAKE_JWT_KNOWN_SUPERUSER),
      FAKE_REQ_UNKNOWN_USER                                        = _makeFakeReqFromToken(FAKE_JWT_UNKNOWN_USER),
      FAKE_REQ_EXPIRED                                             = _makeFakeReqFromToken(FAKE_JWT_EXPIRED_SIGNED_WITH_TEST_AGENT_1_SECRET),
      FAKE_REQ_INVALID                                             = _makeFakeReqFromToken(FAKE_JWT_INVALID);

let FAKE_RES,
    FAKE_API_UTILS;

describe('ensureAuthorized middleware', () => {

  beforeEach(() => {
    FAKE_RES       = jasmine.createSpyObj('res', ['send', 'set']);
    FAKE_API_UTILS = jasmine.createSpyObj('apiUtils', ['jsonResponseError']);
  });

  it('allows a whitelisted service to access this service', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_SERVICE, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_NEXT).toHaveBeenCalled();
      done();
    }, 50);
  });

  it('prevents a service from accessing this service if it is not whitelisted', done => {
    const FAKE_NEXT       = jasmine.createSpy('next');
    const whitelist       = process.env.WHITELIST;
    process.env.WHITELIST = R.compose(JSON.stringify, R.assoc(process.env.THIS_SERVICE_NAME, []), JSON.parse)(whitelist);
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_SERVICE, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      process.env.WHITELIST = whitelist;
      done();
    }, 550);
  });

  it('allows an authorized user to access a known resource', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_SUPERUSER, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_NEXT).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('allows an authorized user to access a an endpoint which is not a tenancy resource', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_NON_TENANCY_RESOURCE, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_NEXT).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('prevents an non-whitelisted service from accessing this service', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_UNKNOWN_SERVICE, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('prevents a service from accessing this service if the token does not declare an intended audience', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_MISSING_AUDIENCE, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('prevents a service from accessing this service if the token was meant for another audience', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_UNKNOWN_AUDIENCE, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('prevents an unauthorized user from accessing a restricted resource', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when no token is provided in the request', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_NO_TOKEN, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when user does not have permission to access resource', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_USER_WHO_DOES_NOT_HAVE_PERMISSION, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when given a malformed request', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_NO_METHOD, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when agent is not found', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_UNKNOWN_AGENT, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when cloudUser is not found', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_UNKNOWN_USER, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when token is expired', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_EXPIRED, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 when token is bad', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_INVALID, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('successfully continues if agent token can be verified', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_AGENT, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('successfully continues if cloudUser token can be verified', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_KNOWN_USER_WHO_HAS_PERMISSION, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_NEXT).toHaveBeenCalled();
      done();
    }, 150);
  });

  it('sends a 401 if a required env var is missing', done => {
    const FAKE_NEXT       = jasmine.createSpy('next');
    const whitelist       = process.env.WHITELIST;
    process.env.WHITELIST = '';

    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_NO_METHOD, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      process.env.WHITELIST = whitelist;
      done();
    }, 150);
  });

  it('sends a 401 if a public key can not be found which matches the signing private key', done => {
    const FAKE_NEXT = jasmine.createSpy('next');
    ensureAuthorized(FAKE_API_UTILS)(FAKE_REQ_BAD_KEY, FAKE_RES, FAKE_NEXT);
    setTimeout(() => {
      expect(FAKE_API_UTILS.jsonResponseError).toHaveBeenCalled();
      done();
    }, 150);
  });
});
