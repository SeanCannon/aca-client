import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchTenantAccessRoles = () => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessRole';

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all access roles'))
    .then(res => {
      dispatch({
        type : 'service.RBAC.fetchTenantAccessRoles',
        data : res.data
      });
      return res;
    })
    .catch(handleError);
};

export default fetchTenantAccessRoles;
