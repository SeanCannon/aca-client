import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const checkTenantAccessPermission = (uri, method, cloudUserId) => (dispatch, getState) => {
  const url = `${getApiRoot()}/api/v1/tenantAccessPermission/public/check/${btoa(uri)}/${method}/${cloudUserId}`;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('Permission check'))
    .then(res => {
      console.log('permission check res = ', res, uri, method);
      dispatch({
        type : 'service.RBAC.checkTenantAccessPermission',
        data : { resource : `${uri}:${method}`, permission : res.data.hasPermission }
      });
      return res;
    })
    .catch(handleError);
};

export default checkTenantAccessPermission;
