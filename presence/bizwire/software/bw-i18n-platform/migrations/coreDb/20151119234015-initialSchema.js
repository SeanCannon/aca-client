'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var filePath = path.join(__dirname, '/../../sql/migrations/coreDb/', '20151119234015-initialSchema-up.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      data = data.replace(/__CORE_DB_NAME__/g, process.env.CORE_DB_NAME);
      resolve(data);
    });
  })
    .then(function(data) {
      return db.runSql(data);
    });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, '/../../sql/migrations/coreDb/', '20151119234015-initialSchema-down.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      data = data.replace(/__CORE_DB_NAME__/g, process.env.CORE_DB_NAME);
      resolve(data);
    });
  })
    .then(function(data) {
      return db.runSql(data);
    });
};

exports._meta = {
  "version": 1
};
