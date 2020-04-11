'use strict';

const R                        = require('ramda'),
      shortid                  = require('shortid'),
      apiUtils                 = require('alien-node-api-utils'),
      config                   = require('config'),
      { scrubErrorForBrowser } = require('./res');

const ERROR_CODE_UNAUTHORIZED          = R.path(['errors', 'UNAUTHORIZED_API_ACCESS'], config),
      ERROR_CODE_PROP                  = 'code',
      GENERAL_UNCAUGHT_EXCEPTION_ERROR = {
        code    : 9999,
        message : 'There is a problem on the server. Please try again later'
      };

const maybeGetMessageFromJsError      = R.when(R.has('message'), R.prop('message'));
const makeGenericErrorObject          = R.compose(R.mergeDeepRight(R.objOf('code', 0)), R.objOf('message'), maybeGetMessageFromJsError);
const ensureErrorIsObject             = R.unless(R.has('code'), makeGenericErrorObject);
const maybeGetErrorCodeFromFirstError = R.compose(R.propOr(ERROR_CODE_UNAUTHORIZED, ERROR_CODE_PROP), R.head);
const ensureArrayOfApiFriendlyErrors  = R.compose(R.flatten, R.append(R.__, []), ensureErrorIsObject);

/**
 * Invoke API response which utilizes success/error status codes and formats, respectively.
 * @param {Object} req
 * @param {Object} res
 * @param {Object} logger Initialized from SDK so it should have reference to metadata
 * @param {String} controllerName
 * @param {Function} fn   Expected to return a promise
 * @returns {Promise.<T>|*}
 */
const respondWithErrorHandling = R.curry((req, res, next, logger, controllerName, fn) => {

  const perfLogData = {
    metricId       : shortid.generate(),
    processName    : R.pathOr('(NOT AVAILABLE ON PROCESS)', ['env', 'THIS_PROCESS_NAME'], process),
    controllerName : controllerName,
    apiPath        : req.originalUrl
  };

  const startTime = new Date().getTime();

  const mergeEndTime = (obj, startTime) => R.mergeDeepRight(obj, {
    elapsedTime : new Date().getTime() - startTime
  });

  logger.perfStart(perfLogData);

  return Promise.resolve()
    .then(fn)
    .then(v => {
      logger.perfEndSuccess(mergeEndTime(perfLogData, startTime));
      return v;
    })
    .then((v) => {
      logger.info({ msg : 'API response', response : v });
      return v;
    })
    .then(apiUtils.jsonResponseSuccess(req, res))
    .catch(err => {
      logger.err(err);
      logger.perfEndFail(mergeEndTime(perfLogData, startTime));
      let responseError = scrubErrorForBrowser(err, req);
      logger.info({ msg : 'API response', err : responseError });
      return apiUtils.jsonResponseError(req, res, next, config.errors.decorateForJson(responseError));
    });
});

module.exports = {
  ensureArrayOfApiFriendlyErrors,
  maybeGetErrorCodeFromFirstError,
  respondWithErrorHandling,
  jsonResponseSuccess           : apiUtils.jsonResponseSuccess,
  jsonResponseError             : apiUtils.jsonResponseError,
  jsonResponseUncaughtException : R.partialRight(apiUtils.jsonResponseError, [GENERAL_UNCAUGHT_EXCEPTION_ERROR])
};
