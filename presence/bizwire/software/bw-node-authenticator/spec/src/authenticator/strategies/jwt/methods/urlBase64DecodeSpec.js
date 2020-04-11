'use strict';

const urlBase64Decode = require('../../../../../src/authenticator/strategies/jwt/methods/urlBase64Decode');

const FAKE_STR_NO_SPECIAL_CHARS           = 'foo',
      FAKE_STR_WITH_PLUS                  = 'foo+',
      FAKE_STR_WITH_SLASH                 = 'foo/',

      FAKE_ENCODED_STR_NO_SPECIAL_CHARS   = 'Zm9v',
      FAKE_ENCODED_STR_WITH_PLUS          = 'Zm9vKw==',
      FAKE_ENCODED_STR_WITH_SLASH         = 'Zm9vLw==',

      FAKE_ENCODED_STR_SIX                = 'abcdef',
      FAKE_DECODED_STR_SIX                = 'i·\u001dy',
      FAKE_ENCODED_STR_SEVEN              = 'abcdefg',
      FAKE_DECODED_STR_SEVEN              = 'i·\u001dyø',
      FAKE_MALFORMED_ENCODED_STR_FIVE     = 'abcde',
      MALFORMED_ENCODED_STR_ERROR_MESSAGE = 'Illegal base64url string!';


describe('urlBase64Decode', () => {
  it('decodes a Base64 URL encoded string', () => {
    expect(urlBase64Decode(FAKE_ENCODED_STR_NO_SPECIAL_CHARS)).toBe(FAKE_STR_NO_SPECIAL_CHARS);
  });

  it('decodes a Base64 URL encoded string with a plus', () => {
    expect(urlBase64Decode(FAKE_ENCODED_STR_WITH_PLUS)).toBe(FAKE_STR_WITH_PLUS);
  });

  it('decodes a Base64 URL encoded string with a slash', () => {
    expect(urlBase64Decode(FAKE_ENCODED_STR_WITH_SLASH)).toBe(FAKE_STR_WITH_SLASH);
  });

  it('returns an empty string when no string is provided', () => {
    expect(urlBase64Decode()).toBe('');
  });

  it('pads and decodes a Base64 URL string where string.length % 4 = 2', () => {
    expect(urlBase64Decode(FAKE_ENCODED_STR_SIX)).toBe(FAKE_DECODED_STR_SIX);
  });

  it('pads and decodes a Base64 URL string where string.length % 4 = 3', () => {
    expect(urlBase64Decode(FAKE_ENCODED_STR_SEVEN)).toBe(FAKE_DECODED_STR_SEVEN);
  });

  it('pads and decodes a Base64 URL string where string.length % 4 = 1', () => {
    expect(() => {
      urlBase64Decode(FAKE_MALFORMED_ENCODED_STR_FIVE);
    }).toThrow(MALFORMED_ENCODED_STR_ERROR_MESSAGE);
  });
});

