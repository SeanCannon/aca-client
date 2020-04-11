'use strict';

const btoa = require('btoa');

const urlBase64Encode = str => str ? btoa(str).replace('+', '-').replace('/', '_') : '';

module.exports = urlBase64Encode;
