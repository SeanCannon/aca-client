'use strict';

const express     = require('express'),
      router      = express.Router(),
      verifyEmail = require('../../controllers/verifyEmail'),
      fetch       = require('node-fetch'),
      CredoSdk    = require('credosdk');

const PING_EMAIL = 'foo@example.com';

const mockAuthCheck = (req, res, next) => {
  next();
};

// https://emailverification.service.credomobile.com/api/v1/verify
router.get('/email/:email', mockAuthCheck, (req, res) => {
  const credoSdk = CredoSdk.initFromReq(req);

  credoSdk.util.api.respondWithErrorHandling(
    req, res, credoSdk.service.logger, 'verifyEmail',
    () => verifyEmail(credoSdk, fetch, req.params.email)
  );
});

// https://emailverification.service.credomobile.com/api/v1/ping
router.get('/ping', (req, res) => {
  const credoSdk = CredoSdk.initFromReq(req);

  return verifyEmail(fetch, PING_EMAIL)
    .then(() => res.status(200).send(true))
    .catch((err) => {
      credoSdk.service.logger.error('Error in ping controller : ', err);
      res.status(500).send(false);
    });
});

module.exports = router;
