import * as R from 'ramda';

import { getAuthToken } from '../Auth';

const makeCommonFetchOptions = options => R.compose(
  R.mergeDeepRight({
    method  : 'GET',
    headers : {
      'Content-Type'  : 'application/json',
      'Authorization' : `Bearer ${getAuthToken()}`,
      'Cache-Control' : 'no-cache'
    }
  }),
  R.defaultTo({})
)(options);

export default makeCommonFetchOptions;
