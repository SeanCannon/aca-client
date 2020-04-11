/*jslint node: true */
'use strict';

const express = require('express'),
      router  = express.Router();

const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl);

module.exports = router;
