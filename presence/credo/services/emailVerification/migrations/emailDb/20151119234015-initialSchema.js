var dbm  = global.dbm || require('db-migrate');
var type = dbm.dataType;
var fs   = require('fs');
var path = require('path');
var R    = require('ramda');

exports.up = function(db, callback) {
  var filePath = path.join(__dirname + '/../../sql/migrations/emailDb/20151119234015-initialSchema-up.sql');
  fs.readFile(filePath, {encoding : 'utf-8'}, function(err, data) {
    if (err) {
      return callback(err);
    }

    data = R.replace(/__DB_PREFIX__/g, '', data);

    db.runSql(data, function(err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
};

exports.down = function(db, callback) {
  var filePath = path.join(__dirname + '/../../sql/migrations/emailDb/20151119234015-initialSchema-down.sql');
  fs.readFile(filePath, {encoding : 'utf-8'}, function(err, data) {
    if (err) {
      return callback(err);
    }

    data = R.replace(/__DB_PREFIX__/g, '', data);

    db.runSql(data, function(err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  });
};
