#!/usr/bin/env bash

# Manages docker-compose for this project. The first two arguments are required and must be the environment name
# (eg. test, demo, production), followed by the command to pass to docker (eg. up, down). Any additional arguments
# will be passed to the docker-compose command as additional arguments.
#
# If the environment variable DOCKER_COMPOSE_FILES is defined, it will be inserted into the docker-compose call
# before the command. This is intended to allow specification of multiple compose files as follows:
#
# export DOCKER_COMPOSE_FILES="-f docker-compose.yml docker-compose-auth-service.yml"
# ./docker.sh test up
#
# usage: ./docker.sh ENV_NAME COMMAND [ARG1 [ARG2 [...]]]

set -x
DOCKER_COMPOSE_FILES=${DOCKER_COMPOSE_FILES:-}

env_name=$1
shift

docker_command=$1
shift

set -a
. ./run/env/${env_name}/.env
set +a

if [ "${docker_command}" = "up" ]; then
  rm -rf ./tmp
  mkdir -p -m 0755 ./tmp/env/${env_name}
  docker-compose $DOCKER_COMPOSE_FILES up $@
else
  docker-compose $DOCKER_COMPOSE_FILES down $@
fi
set +x