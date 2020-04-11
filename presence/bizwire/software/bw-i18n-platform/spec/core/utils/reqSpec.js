'use strict';

const R = require('ramda');

const reqUtils = require('../../../server/core/utils/req');

const FAKE_CUSTOM_HEADERS = {
  'x-test-header-1' : 'foo',
  'x-test-header-2' : 'bar'
};

const FAKE_REQUEST_OBJECT = {
  headers : R.mergeRight({ hostname : 'test.com' }, FAKE_CUSTOM_HEADERS)
};

const EXPECTED_ROOT_URL          = 'https://test.com/',
      EXPECTED_ROOT_URL_FAILOVER = 'https://localhost/';

describe('getRootUrlFromReq', () => {
  it('creates a URL from a host header', () => {
    expect(reqUtils.getRootUrlFromReq(FAKE_REQUEST_OBJECT)).toBe(EXPECTED_ROOT_URL);
  });
  it('falls back to localhost if no headers', () => {
    expect(reqUtils.getRootUrlFromReq({})).toBe(EXPECTED_ROOT_URL_FAILOVER);
  });
  it('falls back to localhost if no host is in the header', () => {
    expect(reqUtils.getRootUrlFromReq({ headers : {} })).toBe(EXPECTED_ROOT_URL_FAILOVER);
  });
  it('extracts custom headers from the request object', () => {
    expect(reqUtils.extractCustomHeadersFromObject(FAKE_REQUEST_OBJECT.headers)).toEqual(FAKE_CUSTOM_HEADERS);
  });
});

