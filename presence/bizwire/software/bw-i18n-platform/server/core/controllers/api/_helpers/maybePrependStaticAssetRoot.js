'use strict';

const R      = require('ramda'),
      config = require('config');

const staticAssetRoot = `${config.aws.endpoint}/${config.aws.bucket}/`;

const maybePrependStaticAssetRoot = path => R.over(
  R.lensPath(path),
  R.when(
    R.both(
      R.identity,
      R.complement(R.startsWith(staticAssetRoot))
    ),
    R.concat(staticAssetRoot)
  )
);

module.exports = maybePrependStaticAssetRoot;
