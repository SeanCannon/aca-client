'use strict';

module.exports = {
  getLegacyUserByUsername                  : require('./methods/getLegacyUserByUsername'),
  getLegacyUserByUsernameMfa               : require('./methods/getLegacyUserByUsernameMfa'),
  verifyRefreshTokenByUsernameRefreshToken : require('./methods/verifyRefreshTokenByUsernameRefreshToken'),
  sendSmsTwilio                            : require('./methods/sendSmsTwilio'),
  verifyTokenTwilio                        : require('./methods/verifyTokenTwilio'),
  getQrCodeTwilio                          : require('./methods/getQrCodeTwilio')
};
