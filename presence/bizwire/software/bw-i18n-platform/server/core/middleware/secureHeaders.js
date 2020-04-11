'use strict';

/**
 * Taken from here
 * @see https://medium.freecodecamp.org/secure-your-web-application-with-these-http-headers-fd66e0367628
 * @param req
 * @param res
 * @param next
 */
const secureHeaders = (req, res, next) => {
  res.set('Strict-Transport-Security', 'max-age=3600');

  // TODO need a real report url..
  //res.set('Expect-CT', 'max-age=3600, enforce, report-uri="https://ct.example.com/report"');
  res.set('X-Frame-Options', 'SAMEORIGIN');

  // TODO this one is more complex for env-specific, need to inject via config
  //res.set('Content-Security-Policy', `default-src 'self'; script-src scripts.example.com; img-src *; media-src medias.example.com medias.legacy.example.com`);
  res.set('X-XSS-Protection', '1');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Permitted-Cross-Domain-Policies', 'none');
  next();
};

module.exports = secureHeaders;
