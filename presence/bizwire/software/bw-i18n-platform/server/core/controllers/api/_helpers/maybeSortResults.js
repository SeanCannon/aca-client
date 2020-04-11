'use strict';

const R = require('ramda');

const maybeSortResults = R.curry((req, results) => {
  const sortName = R.path(['query', 'sortName'], req);
  let sort;

  if (sortName) {
    try {
      sort = require('../_sorters/' + sortName);
    } catch (err) {
      req.logger.child({ sortName }).error({ msg: 'Exception thrown in maybeSort: ', err });
      sort = R.always(results);
    }
  } else {
    sort = R.always(results);
  }

  return sort(results);
});

module.exports = maybeSortResults;
