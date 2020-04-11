import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';
import fetchTenantByDomain    from './fetchTenantByDomainThunk';

import { getAuthToken } from '../Auth';
import { store }        from '../../store';

const getPublicOrPrivateApiUrl = (tenantId, subdomain) => {
  const maybePublic = 'public/'; // getAuthToken() ? '' : 'public/';
  return getApiRoot() + `/api/v1/tenantLocation/${maybePublic}tenantId/${tenantId}/subdomain/${subdomain}`;
};

const getTenantFromRes = R.prop('data');

const fetchTenantAndLocationByDomains = (domain, subdomain) => (dispatch, getState) => {
  const options = makeCommonFetchOptions();

  return fetchTenantByDomain(domain)(store.dispatch, null)
    .then(getTenantFromRes)
    .then(tenant => fetch(getPublicOrPrivateApiUrl(tenant.id, subdomain), options))
    .then(jsonOrError('Fetch tenant and location public account details'))
    .then(res => {
      dispatch({
        type : 'service.Tenant.fetchTenantLocationByTenantIdAndSubdomain',
        data : res.data
      });
      dispatch({
        type : 'app.ensureTenancyLocation',
        data : res.data
      });
    })
    .catch(handleError);
};

export default fetchTenantAndLocationByDomains;
