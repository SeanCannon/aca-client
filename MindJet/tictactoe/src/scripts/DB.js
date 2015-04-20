(function () {
  'use strict';

  /**
   * Local database shim. Will use localStorage
   * for this project.
   * @constructor
   */
  function DB () {}

  /**
   * Add or update a record.
   * @param {String} key
   * @param {*} val
   * @returns {DB}
   */
  DB.prototype.set = function (key, val) {
    localStorage.setItem(key, val);
    return this;
  };

  /**
   * Get a record.
   * @param {String} key
   * @returns {*}
   */
  DB.prototype.get = function (key) {
    return localStorage.getItem(key);
  };

  /**
   * Delete a record.
   * @param {String} key
   * @returns {DB}
   */
  DB.prototype.remove = function (key) {
    localStorage.removeItem(key);
    return this;
  };

  module.exports = new DB();

}());