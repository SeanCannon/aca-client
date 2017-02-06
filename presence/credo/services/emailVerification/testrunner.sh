#!/bin/bash

export NODE_ENV=test $(cat ./.env)
./node_modules/.bin/istanbul cover -x '**/spec/_helpers/**/*' ./node_modules/jasmine/bin/jasmine.js