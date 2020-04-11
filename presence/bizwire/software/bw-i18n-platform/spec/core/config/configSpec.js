'use strict';

const config = require('config');

const FAKE_ERR           = { foo : 'bar' },
      FAKE_DECORATED_ERR = {
        err        : FAKE_ERR,
        statusCode : 501
      };

describe('config', () => {
  it('decorates an error for json logging', () => {
    expect(config.errors.decorateForJson(FAKE_ERR)).toEqual(FAKE_DECORATED_ERR);
  });
});
