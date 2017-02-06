'use strict';

// Dependencies
const express                   = require('express'),
      app                       = express(),

      // Routes
      coverageCheckApiRoutes    = require('./routes/api/coverageCheck');

const logUncaughtExceptions = (err, req, res, next) => {
  const credosdk = require('credosdk').initFromReq(req);
  credosdk.service.logger.error(err);
  credosdk.util.api.jsonResponseUncaughtException(req, res);
};

// Routing
app.use('/api/v1/coveragecheck?', coverageCheckApiRoutes, logUncaughtExceptions);

module.exports = app;

