'use strict';

const R    = require('ramda'),
      exec = require('child_process').exec;

const THIRTY_MINUTES_IN_MS = 1800000;

const bash = command => new Promise((resolve, reject) => {
  const child = exec(command, {
    env       : process.env,
    timeout   : THIRTY_MINUTES_IN_MS,
    maxBuffer : Infinity
  }, (error, stdout, stderr) => {

    if (error) {
      reject(R.mergeDeepRight(error, { stdout, stderr, message : { command, error }}));
    }

    resolve(R.defaultTo('ok', stdout));
  });

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.pipe(child.stdin);
});

module.exports = bash;
