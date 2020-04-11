import jsonOrError                      from '../_helpers/jsonOrError';
import handleError                      from '../_helpers/handleError';
import makeCommonFetchOptions           from '../_helpers/makeCommonFetchOptions';
import getApiRoot                       from '../_helpers/getApiRoot';
import fetchTenantAccessRoleAssignments from './fetchTenantAccessRoleAssignmentsThunk';

const maybeDeleteTenantAccessRoleAssignment = id => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessRoleAssignment/id/' + id;

  const fetchOptions = {
    method : 'DELETE'
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Remove a user from an access role'))
    .then(res => {
      dispatch(fetchTenantAccessRoleAssignments());
      return res;
    })
    .catch(handleError);

};

export default maybeDeleteTenantAccessRoleAssignment;
