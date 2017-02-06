// Load Environment variables
// App requires a .env file in root directory which is NOT included in the repo!
// The .env file should be a populated version of the .env.example file which is included in the repo.
require('dotenv-safe').load();

const config    = require('config'),
      httpProxy = require('http-proxy'),
      app       = require('./core.js'),
      http      = require('http');

const proxy = httpProxy.createProxyServer();

const targets = config.server.clusterPaths.map(path => ({ target: path }));

http.createServer((req, res) => {
  const index = Math.ceil(targets.length * Math.random()) - 1;
  proxy.web(req, res, targets[index]);
}).listen(config.server.mainPort);

const startServers = () => {
  config.server.clusterPorts.forEach(port => http.Server(app).listen(port));
};

startServers();
