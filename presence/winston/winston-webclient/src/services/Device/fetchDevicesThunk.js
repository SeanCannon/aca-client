import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchDevices = () => (dispatch, getState) => {

  const url = `${getApiRoot()}/api/v1/registeredDevice`;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all hardware devices'))
    .then(R.prop('data'))
    .then(res => {
      dispatch({
        type : 'service.Device.fetchDevices',
        data : res
      });
      return res;
    })
    .catch(handleError);
};

export default fetchDevices;
