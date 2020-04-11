'use strict';

const config = {
  db : {
    mysql : {
      poolConfig : {
        connectionLimit    : 10,
        host               : process.env.CORE_DB_HOST,
        user               : process.env.CORE_DB_USER,
        password           : process.env.CORE_DB_PASSWORD,
        port               : process.env.CORE_DB_PORT,
        multipleStatements : true
      }
    }
  }
};

module.exports = config;

// eslint-disable-next-line no-console
console.log('USING DEMO CONFIG');
