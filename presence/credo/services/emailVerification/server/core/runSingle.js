// Load Environment variables
// App requires a .env file in root directory which is NOT included in the repo!
// The .env file should be a populated version of the .env.example file which is included in the repo.
require('dotenv-safe').load();

const config    = require('config'),
      app       = require('./core.js'),
      http      = require('http');

const startServer = () => {
  http.Server(app).listen(config.server.mainPort);
};

startServer();
