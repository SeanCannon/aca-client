import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const saveCloudUser = (id, updateData) => {
  const url = getApiRoot() + '/api/v1/cloudUser/id/' + id;

  const fetchOptions = {
    method : 'PUT',
    body   : R.compose(JSON.stringify, R.defaultTo({}))(updateData)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Save user details'));
};

const saveTenantMember = (tenantMemberId, cloudUserId) => {
  const url = getApiRoot() + '/api/v1/tenantMember/id/' + tenantMemberId;

  const fetchOptions = {
    method : 'PUT',
    body   : `{"cloudUserId":${cloudUserId}}`
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Save member details'));
};

const saveMember = (cloudUserId, tenantMemberId, updateData) => {
  return saveCloudUser(cloudUserId, updateData)
    .then(() => saveTenantMember(tenantMemberId, cloudUserId))
    .catch(handleError);
};

export default saveMember;
