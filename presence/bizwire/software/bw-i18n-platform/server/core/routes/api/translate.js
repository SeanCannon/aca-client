'use strict';

const config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      path     = require('path'),
      i18n     = require('i18n'),
      apiUtils = require('../../utils/api');

const { ensureAuthorized } = require('@businesswire/bw-node-authenticator')(config.auth.strategy);

const translate = require('../../controllers/api/translate/translate');

i18n.configure({
  defaultLocale : 'en',
  updateFiles   : false,
  directory     : path.resolve(__dirname + '../../../../../locales')
});

// https://platform.bw-i18n-platform.test:1343/api/v1/i18n/translate
router.post('/', ensureAuthorized, (req, res, next) => {
  const { locale, strings } = req.body;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ locale, strings }),
    'translate',
    () => translate({ i18n, locale })(strings)
  );
});

module.exports = router;
