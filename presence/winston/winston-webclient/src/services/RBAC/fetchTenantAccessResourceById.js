import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchTenantAccessResourceById = id => {
  const url = getApiRoot() + '/api/v1/tenantAccessResource/id/' + id;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('Get an access resource details'))
    .catch(handleError);
};

export default fetchTenantAccessResourceById;
