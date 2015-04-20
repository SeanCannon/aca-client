(function () {
  'use strict';

  // @todo add support for channels.

  var events  = require('events'),
      emitter = new events.EventEmitter();

  // This helps verify that the module
  // is a singleton.
  emitter.id  = Math.random();

  module.exports = emitter;

}());