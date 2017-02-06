'use strict';

const winston = require('winston');

const config = {

  db : {
    mysql   : {
      dbPrefix   : 'test-',
      poolConfig : {
        connectionLimit    : 10,
        host               : 'localhost',
        user               : 'root',
        password           : 'root',
        multipleStatements : true
      }
    },
    mongoDb : {
      client : 'mongo-mock'
    }
  },

  redis : {
    client   : 'redistub',
    host     : 'localhost',
    port     : 6379,
    password : ''
  }

};

module.exports = config;

console.log('USING TEST CONFIG');
