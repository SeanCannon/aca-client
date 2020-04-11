#!/usr/bin/env bash

set -a
. ./run/env/demo/.env
set +a

set -a
. ./.env
set +a

node << EOF

require('./server/platform.js');
console.info('Restarted core.js...demo platform server is running.');

EOF
