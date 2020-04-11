'use strict';

const config = require('config');
const R = require('ramda');

const Log = require('@businesswire/bw-node-logger')({ appName : config.serviceName }, R.path(['logger', 'pino'], config));

module.exports = meta => Log.child(meta);
