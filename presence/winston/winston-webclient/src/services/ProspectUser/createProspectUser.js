import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const createProspectUser = data => {
  const url = getApiRoot() + '/api/v1/prospectUser';

  const fetchOptions = {
    method : 'POST',
    body   : R.compose(JSON.stringify, R.defaultTo({}))(data)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Create prospect user'))
    .catch(handleError);
};

export default createProspectUser;
