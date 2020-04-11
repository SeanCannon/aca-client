import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const linkCloudUser = data => {
  const url = getApiRoot() + '/api/v1/tenantMember';

  const fetchOptions = {
    method : 'POST',
    body   : R.compose(JSON.stringify, R.defaultTo({}))(data)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Link cloud user (create Tenant Member)'))
    .catch(handleError);
};

export default linkCloudUser;