'use strict';

module.exports = function(obj) {
  var err      = new Error();
  err.code     = obj.code;
  err.message  = obj.message;
  return err;
};
