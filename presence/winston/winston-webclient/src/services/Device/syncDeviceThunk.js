import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';
import fetchDeviceMetrics     from './fetchDeviceMetricsThunk';

const applicableProps = ['metaJson', 'status'];

const syncDevice = device => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/registeredDevice/id/' + device.id;

  const fetchOptions = {
    method : 'PUT',
    body   : R.compose(JSON.stringify, R.pick(applicableProps), R.defaultTo({}))(device)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Update hardware device details'))
    .then(res => {
      dispatch(fetchDeviceMetrics());
      return res;
    })
    .catch(handleError);
};

export default syncDevice;
