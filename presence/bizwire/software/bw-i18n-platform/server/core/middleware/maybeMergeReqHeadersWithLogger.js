'use strict';

module.exports = (req, res, next) => {
  req.logger = require('../services/log/Log')({
    requestId : req.get('X-RequestID')
  });
  if (process.env.ALLOW_DEBUG === 'true') {
    req.logger.debug({ headers : req.headers });
  }

  next();
};
