import * as R from 'ramda';

import { getAuthToken } from '../Auth';

const makeUploadFetchOptions = options => R.compose(
  R.mergeDeepRight({
    method  : 'POST',
    headers : {
      'Authorization' : `Bearer ${getAuthToken()}`,
      'Cache-Control' : 'no-cache'
    }
  }),
  R.defaultTo({})
)(options);

export default makeUploadFetchOptions;
