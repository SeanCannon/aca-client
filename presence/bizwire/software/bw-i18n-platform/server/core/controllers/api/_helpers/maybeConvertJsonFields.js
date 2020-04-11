'use strict';

const R = require('ramda');

const tryJson__ = f => v => R.tryCatch(JSON[f], R.always(v))(v);

const maybeJson__ = f => R.compose(
  R.evolve,
  R.mergeAll,
  R.map(p => R.ifElse(
    R.is(Array),
    R.assocPath(R.__, tryJson__(f), {}),
    R.objOf(R.__, tryJson__(f))
  )(p))
);

module.exports = {
  parse     : maybeJson__('parse'),
  stringify : maybeJson__('stringify')
};
