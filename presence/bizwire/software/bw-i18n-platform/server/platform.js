'use strict';

const R      = require('ramda'),
      config = require('config'),
      http   = require('http');

const core   = require('./core/core'),
      logger = require('./core/services/log/Log')({});

const nodePorts = config.server.nodePorts;

const startServerOnPort = port => {
  http.createServer(core).listen(port);
  logger.info({ msg : `Server started and listening on port ${port}` });
};

const startServers = R.forEach(startServerOnPort);

logger.info({ msg : '* Starting servers...' });
try {
  startServers(nodePorts);

  if (process.env.ALLOW_DEBUG === 'true') {
    logger.info({ env : process.env });
    logger.info({ config });
  }
} catch (err) {
  logger.err(err);
  process.exit(1);
}
