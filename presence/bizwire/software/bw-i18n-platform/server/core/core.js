'use strict';

// Dependencies
const path                           = require('path'),
      config                         = require('config'),
      bodyParser                     = require('body-parser'),
      apiUtils                       = require('alien-node-api-utils'),

      // Express app
      express                        = require('express'),
      app                            = express(),
      logger                         = require('./services/log/Log')({}),
      { scrubErrorForBrowser }       = require('./utils/res'),

      // Middleware
      allowCors                      = require('./middleware/allowCors'),
      secureHeaders                  = require('./middleware/secureHeaders'),
      maybeMergeReqHeadersWithLogger = require('./middleware/maybeMergeReqHeadersWithLogger'),

      // Routes
      ping                           = (req, res) => res.send('pong ' + new Date().toISOString()),
      unknown                        = (req, res) => res.status(404).json({ data : { code : 1234, message : 'unknown'} }) ,
      health                         = require('./routes/health'),
      translateApiRoutes             = require('./routes/api/translate');

const { error, errors } = require('@businesswire/bw-node-error');

const clientGlobals = `window.BW = { 
  errors : ${ JSON.stringify(config.errors) },
  meta   : {}
};`;

const globals = (req, res) => res.set('Content-Type', 'application/javascript').send(clientGlobals);

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ msg : 'unhandledRejection', err : reason, promise });
});


// Because we catch all thrown controller exceptions in our middleware
const logUncaughtExceptions = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  try {
    (req.logger) ? req.logger.error({
        msg : 'Uncaught BusinessWire Platform Exception at highest level: ',
        err
      }) :
      /* eslint-disable-next-line */
      console.log('Uncaught BusinessWire Platform Exception at highest level: ', err);

    let responseError = scrubErrorForBrowser(err, req);

    apiUtils.jsonResponseError(req, res, next, responseError);
  } catch (err) {
    (req.logger) ? req.logger.error({
        msg : 'Uncaught BusinessWire Platform Exception at highest level: ', err
      }) :
      /* eslint-disable-next-line */
      logger.error({ msg : 'Uncaught BusinessWire Platform Exception at highest level', err });
    const uncaughtErr = error(errors.system.UNCAUGHT({ debug : { originalError : err } }));
    return next(uncaughtErr);
  }
};

// Load Environment variables and crash the app if any listed in .env.example are missing.
require('dotenv-safe').config();

// View rendering
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/views/*', (req, res) => res.render(path.resolve(app.get('views'), req.params[0])));

// Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

// CORS middleware must come before routes
app.use(maybeMergeReqHeadersWithLogger);
app.use(allowCors);
app.use(secureHeaders);

// Routing
app.use('/ping',                  ping);
app.use('/health',                health);
app.use('/globals',               globals);
app.use('/api/v1/i18n/translate', translateApiRoutes);
app.use('*',                      unknown);

app.use(logUncaughtExceptions);

module.exports = app;
