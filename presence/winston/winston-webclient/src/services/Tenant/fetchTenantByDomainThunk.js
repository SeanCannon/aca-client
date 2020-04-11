import jsonOrError            from '../_helpers/jsonOrError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';
import { getAuthToken }       from '../Auth';

const handleError = err => {
  console.error(err);
  // window.localStorage.clear();
  // window.sessionStorage.clear();
  // window.location = process.env.REACT_APP_WEB_ROOT;
};

const fetchTenantByDomain = domain => (dispatch, getState) => {
  const url     =  getApiRoot() + '/api/v1/tenant/public/domain/' + domain,
        options = makeCommonFetchOptions();

  return fetch(url, options)
    .then(jsonOrError('Fetch tenant public account details'))
    .then(res => {
      dispatch({
        type : 'service.Tenant.fetchTenantByDomain',
        data : res.data
      });
      dispatch({
        type : 'app.ensureTenancyTenant',
        data : res.data
      });
      return res;
    })
    .catch(handleError);
};

export default fetchTenantByDomain;
