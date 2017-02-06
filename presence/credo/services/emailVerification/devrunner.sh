#!bash

export NODE_ENV=dev $(cat ./.env)
./node_modules/.bin/nodemon ./server/core/runCluster.js