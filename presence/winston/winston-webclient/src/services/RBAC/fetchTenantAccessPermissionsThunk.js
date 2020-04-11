import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

import fetchTenantAccessResourceById from './fetchTenantAccessResourceById';

const fetchAssignedResource = permission => {
  return fetchTenantAccessResourceById(permission.tenantAccessResourceId)
    .then(R.prop('data'))
    .then(R.assoc('tenantAccessResource', R.__, permission));
};

const fetchTenantAccessPermissions = () => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessPermission';

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all access permissions'))
    .then(R.prop('data'))
    .then(R.map(fetchAssignedResource))
    .then(p => Promise.all(p))
    .then(res => {
      dispatch({
        type : 'service.RBAC.fetchTenantAccessPermissions',
        data : res
      });
      return res;
    })
    .catch(handleError);
};

export default fetchTenantAccessPermissions;
