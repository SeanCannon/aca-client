#!/usr/bin/env bash

set -a
. ./run/env/test/.env
set +a

OS=$(bash ./scripts/echo_os.sh)

if [ ! -d "./spec/support/logs" ]; then
  mkdir ./spec/support/logs
fi

RUN_TESTS() {
  ./node_modules/.bin/istanbul cover -x '**/spec/_helpers/**/*' ./node_modules/.bin/jasmine
}

if [ ${OS} == "WINDOWS" ]; then
  RUN_TESTS
elif [ ${OS} == "LINUX" ]; then
  RUN_TESTS
elif [ ${OS} == "MAC" ]; then
  RUN_TESTS && say 'Unit Tests Passed' || say 'Unit Tests Failed'
fi
