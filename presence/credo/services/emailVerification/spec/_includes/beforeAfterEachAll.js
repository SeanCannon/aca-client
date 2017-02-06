'use strict';

const fs = require('fs');

beforeAll(function (done) {
  require('dotenv-safe').load();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  fs.truncate(__dirname + '/../support/logs/log.log', 0, done);
});
