// 'use strict';
//
// const Q = require('q');
//
// const checkCoverage = require('../../../server/core/controllers/checkCoverage');
// const config        = require('config');
//
// const COVERED_ZIP_CODE = '94105';
// const BAD_ZIP_CODE = '9538933';
//
// const fakeFetch = (testRecord, json = {Result: { IsCovered: true }}, ok = true) => (url, opts) => {
//   testRecord.url = url;
//   testRecord.opts = opts;
//
//   const res = {
//     ok: ok,
//     json: () => Q(json),
//     text: () => Q(JSON.stringify(json)),
//     clone: () => res
//   };
//   return Q(res);
// };
//
// const fakeSdk = (testRecord) => ({ service: { logger: {
//   info: () => {
//     testRecord.infoLoggerCalled = (testRecord.infoLoggerCalled || 0) + 1;
//   }
// }}});
//
// describe('logic.checkCoverage', () => {
//   it('Uses the correct endpoint URL and Headers', (done) => {
//     const testRecord = {};
//     const fetch = fakeFetch(testRecord);
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, COVERED_ZIP_CODE, '1')
//       .then(() => {
//         expect(testRecord.infoLoggerCalled).toBe(2);
//         expect(testRecord.url).toBe(`${config.credoPlutoCoverageApi.url}/${COVERED_ZIP_CODE}/1`);
//         expect(testRecord.opts.headers).toBe(config.credoPlutoCoverageApi.headers);
//         done();
//       });
//   });
//
//   it('defaults carrierid when not supplied', (done) => {
//     const testRecord = {};
//     const fetch = fakeFetch(testRecord);
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, COVERED_ZIP_CODE)
//       .then(() => {
//         expect(testRecord.infoLoggerCalled).toBe(2);
//         expect(testRecord.url).toBe(`${config.credoPlutoCoverageApi.url}/${COVERED_ZIP_CODE}`);
//         expect(testRecord.opts.headers).toBe(config.credoPlutoCoverageApi.headers);
//         done();
//       });
//   });
//
//   it('handles network errors outside of the coverage logic', (done) => {
//     const fetch = () => {
//       throw new Error('Error');
//     };
//     const testRecord = {};
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, COVERED_ZIP_CODE, '1')
//       .catch((e) => {
//         expect(testRecord.infoLoggerCalled).toBe(1);
//         expect(e.message).toBe('Error');
//         done();
//       });
//   });
//
//   it('throws an error for bad data zipcode', (done) => {
//     const fetch = () => {};
//     const testRecord = {};
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, BAD_ZIP_CODE, '1')
//       .catch((e) => {
//         expect(testRecord.infoLoggerCalled).toBe(undefined);
//         expect(e.message).toBe('Illegal value for parameter: zipCode');
//         done();
//       });
//   });
//
//   it('throws an error for bad carrierid', (done) => {
//     const fetch = () => {};
//     const testRecord = {};
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, COVERED_ZIP_CODE, 'a')
//       .catch((e) => {
//         expect(testRecord.infoLoggerCalled).toBe(undefined);
//         expect(e.message).toBe('Illegal value for parameter: carrierId');
//         done();
//       });
//   });
//
//   it('throws an error for bad formed coverage response', (done) => {
//     const testRecord = {};
//     const fetch = fakeFetch(testRecord, { foo: 'bar' });
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, COVERED_ZIP_CODE, '1')
//     .catch((e) => {
//       expect(testRecord.infoLoggerCalled).toBe(2);
//       expect(e).toBeDefined();
//       done();
//     });
//   });
//
//   it('throws an error when Pluto API return HTTP Status code that is not 200', (done) => {
//     const testRecord = {};
//     const fetch = fakeFetch(testRecord, {}, false);
//     const credoSdk = fakeSdk(testRecord);
//     checkCoverage(credoSdk, fetch, COVERED_ZIP_CODE, '1')
//     .catch((e) => {
//       expect(testRecord.infoLoggerCalled).toBe(2);
//       expect(e.message).toBe('Pluto Coverage check API error');
//       done();
//     });
//   });
// });
