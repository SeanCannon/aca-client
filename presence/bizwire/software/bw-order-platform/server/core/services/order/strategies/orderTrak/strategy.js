'use strict';

const axios = require('axios'),
      https = require('https'),
      path  = require('path'),
      fs    = require('fs');

const key           = fs.readFileSync(path.resolve(__dirname, '../../../../../../bw-auth-platform.test.key')),
      cert          = fs.readFileSync(path.resolve(__dirname, '../../../../../../bw-auth-platform.test.crt')),
      httpsAgent    = new https.Agent({ key, cert }),
      axiosInstance = axios.create({ httpsAgent });

module.exports = {
  getLegacyUserByUsername                  : require('./methods/getLegacyUserByUsername')(axiosInstance),
  getLegacyUserByUsernameMfa               : require('./methods/getLegacyUserByUsernameMfa')(axiosInstance),
  verifyRefreshTokenByUsernameRefreshToken : require('./methods/verifyRefreshTokenByUsernameRefreshToken')(axiosInstance),
  sendSmsTwilio                            : require('./methods/sendSmsTwilio')(axiosInstance),
  verifyTokenTwilio                        : require('./methods/verifyTokenTwilio')(axiosInstance),
  getQrCodeTwilio                          : require('./methods/getQrCodeTwilio')(axiosInstance)
};
