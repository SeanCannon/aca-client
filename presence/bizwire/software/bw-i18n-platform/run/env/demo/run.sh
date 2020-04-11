#!/usr/bin/env bash

set -a
. ./run/env/demo/.env
set +a

set -a
. ./.env +e
set +a

node << EOF
  const resetMySqlFirst = require('./scripts/resetAndSeedTables').init('coreDb').reset;

  require('events').EventEmitter.prototype._maxListeners = 500;

  Promise.resolve()
    .then(resetMySqlFirst)
    .then(() => {
      require('./server/platform.js');
      console.log('Started core.js...demo platform server is running.');
    }).catch(err => {
      console.error('Could not start core.js. Error: ', err);
      process.exit();
    });
EOF
