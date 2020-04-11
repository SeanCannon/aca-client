import * as R from 'ramda';

import jsonOrError                      from '../_helpers/jsonOrError';
import handleError                      from '../_helpers/handleError';
import makeCommonFetchOptions           from '../_helpers/makeCommonFetchOptions';
import getApiRoot                       from '../_helpers/getApiRoot';
import fetchTenantAccessRoleAssignments from './fetchTenantAccessRoleAssignmentsThunk';

const maybeCreateTenantAccessRoleAssignment = data => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantAccessRoleAssignment';

  const fetchOptions = {
    method : 'POST',
    body   : R.compose(JSON.stringify, R.defaultTo({}))(data)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Assign a user to an access role'))
    .then(res => {
      dispatch(fetchTenantAccessRoleAssignments());
      return res;
    })
    .catch(handleError);

};

export default maybeCreateTenantAccessRoleAssignment;
