import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchTenantAccessResources = () => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessResource';

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all access resources'))
    .then(res => {
      dispatch({
        type : 'service.RBAC.fetchTenantAccessResources',
        data : res.data
      });
      return res;
    })
    .catch(handleError);
};

export default fetchTenantAccessResources;
