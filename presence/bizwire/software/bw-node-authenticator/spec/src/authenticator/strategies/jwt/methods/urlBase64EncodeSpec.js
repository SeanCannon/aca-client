'use strict';

const urlBase64Encode = require('../../../../../src/authenticator/strategies/jwt/methods/urlBase64Encode');

const FAKE_STR_NO_SPECIAL_CHARS         = 'foo',
      FAKE_STR_WITH_PLUS                = 'foo+',
      FAKE_STR_WITH_SLASH               = 'foo/',

      FAKE_ENCODED_STR_NO_SPECIAL_CHARS = 'Zm9v',
      FAKE_ENCODED_STR_WITH_PLUS        = 'Zm9vKw==',
      FAKE_ENCODED_STR_WITH_SLASH       = 'Zm9vLw==';

describe('urlBase64Encode', () => {
  it('encodes a string with no URL chars', () => {
    expect(urlBase64Encode(FAKE_STR_NO_SPECIAL_CHARS)).toBe(FAKE_ENCODED_STR_NO_SPECIAL_CHARS);
  });

  it('encodes a string with a plus', () => {
    expect(urlBase64Encode(FAKE_STR_WITH_PLUS)).toBe(FAKE_ENCODED_STR_WITH_PLUS);
  });

  it('encodes a string with a slash', () => {
    expect(urlBase64Encode(FAKE_STR_WITH_SLASH)).toBe(FAKE_ENCODED_STR_WITH_SLASH);
  });

  it('returns an empty string when no string is provided', () => {
    expect(urlBase64Encode()).toBe('');
  });
});
