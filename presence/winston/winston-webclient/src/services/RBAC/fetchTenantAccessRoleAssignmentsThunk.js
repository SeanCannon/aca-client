import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

import { fetchCloudUserById } from '../CloudUser';

const fetchAssignedCloudUser = roleAssignment => {
  return fetchCloudUserById(roleAssignment.cloudUserId)
    .then(R.prop('data'))
    .then(R.assoc('cloudUser', R.__, roleAssignment));
};

const fetchTenantAccessRoleAssignments = () => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessRoleAssignment';

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all access role assignments'))
    .then(R.prop('data'))
    .then(R.map(fetchAssignedCloudUser))
    .then(p => Promise.all(p))
    .then(res => {
      dispatch({
        type : 'service.RBAC.fetchTenantAccessRoleAssignments',
        data : res
      });
      return res;
    })
    .catch(handleError);
};

export default fetchTenantAccessRoleAssignments;
