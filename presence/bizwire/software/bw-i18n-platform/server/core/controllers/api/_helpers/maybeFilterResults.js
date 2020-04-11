'use strict';

const R = require('ramda');

const maybeFilterResults = R.curry((req, results) => {
  const filterName     = R.path(['query', 'filterName'], req),
        _alwaysPromise = R.always(Promise.resolve(results));

  let filterPromise;

  if (filterName) {
    try {
      filterPromise = require('../_filters/' + filterName);
    } catch (err) {
      req.logger.child({ filterName }).error({ msg: 'Exception thrown in maybeFilter, resolving with given list instead. Err: ', err });
      filterPromise = _alwaysPromise;
    }
  } else {
    filterPromise = _alwaysPromise;
  }

  return filterPromise(req, results);

});

module.exports = maybeFilterResults;
