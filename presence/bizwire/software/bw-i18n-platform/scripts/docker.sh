#!/usr/bin/env bash

set -a
. ./run/env/$1/.env
set +a

if [ $2 = "up" ]; then
  rm -rf ./tmp
  mkdir -p -m 0755 ./tmp/env/$1
  docker-compose up
else
  docker-compose down
fi
