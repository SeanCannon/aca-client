import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchDevices = () => {
  const url = `${getApiRoot()}/api/v1/registeredDevice`;
  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all hardware devices'))
    .then(R.propOr([], 'data'));
};

// moment().hours(-1).format('x');
// '1492572481764'
// https://gutfit.gymlens.com/api/v1/lensMetrics/query/{"where":{"r":"Sk1VyuxAx","t":{"$gte":1492569765000,"$lt":1492569765089}}}

const metaLens = R.lensProp('metaJson');

const fetchDeviceMetrics = () => (dispatch, getState) => {

  return fetchDevices()
    .then(R.map(R.over(metaLens, JSON.parse)))
    .then(R.groupBy(R.prop('deviceTypeTitle')))
    .then(res => {
      dispatch({
        type : 'service.Device.fetchDeviceMetrics',
        data : res
      });
      return res;
    })
    .catch(handleError);
  //
  // return fetch(`${getApiRoot()}/api/v1/registeredDevices/tenantLocationId/${tenantLocationId}`)
  //   .then(jsonOrError)
  //   .then(res => {
  //     console.log('res = ', res);
  //     //const devices = // TODO left here, iterate over array
  //     dispatch({
  //       type : 'fetchDeviceMetrics',
  //       data : res.data
  //     });
  //   });
};

export default fetchDeviceMetrics;
