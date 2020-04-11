'use strict';

const DB = dbPool => ({
  resolveOrRejectOnBooleanField : require('./methods/resolveOrRejectOnBooleanField'),
  beginTransaction              : require('./methods/beginTransaction')(dbPool),
  getConnection                 : require('./methods/getConnection')(dbPool),
  query                         : require('./methods/query')(dbPool),
  querySafe                     : require('./methods/querySafe')(dbPool),
  addQueryToTransaction         : require('./methods/addQueryToTransaction'),
  commit                        : require('./methods/commit'),
  lookup                        : require('./methods/lookup')(dbPool),
  lookupSafe                    : require('./methods/lookupSafe')(dbPool),
  fuzzify                       : require('./methods/fuzzify'),
  transformToColumn             : require('./methods/transformToColumn'),
  transformFromColumn           : require('./methods/transformFromColumn'),
  transformQueryResponse        : require('./methods/transformQueryResponse'),
  prepareValues                 : require('./methods/prepareValues'),
  prepareProvidedFieldsForSet   : require('./methods/prepareProvidedFieldsForSet'),
  createNowDateString           : require('./methods/createNowDateString'),
  createNowTimestamp            : require('./methods/createNowTimestamp'),
  createNowUnixTime             : require('./methods/createNowUnixTime'),
  constants                     : require('./constants')
});

module.exports = DB;
