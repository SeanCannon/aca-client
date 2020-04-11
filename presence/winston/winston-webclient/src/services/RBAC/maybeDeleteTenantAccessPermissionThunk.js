import jsonOrError                  from '../_helpers/jsonOrError';
import handleError                  from '../_helpers/handleError';
import makeCommonFetchOptions       from '../_helpers/makeCommonFetchOptions';
import getApiRoot                   from '../_helpers/getApiRoot';
import fetchTenantAccessPermissions from './fetchTenantAccessPermissionsThunk';

const maybeDeleteTenantAccessPermission = id => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessPermission/id/' + id;

  const fetchOptions = {
    method : 'DELETE'
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Revoke permission for an access role'))
    .then(res => {
      dispatch(fetchTenantAccessPermissions());
      return res;
    })
    .catch(handleError);

};

export default maybeDeleteTenantAccessPermission;
