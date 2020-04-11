// import * as R                 from 'ramda';
// import jsonOrError            from '../_helpers/jsonOrError';
// import handleError            from '../_helpers/handleError';
// import fetchDeviceMetrics     from './fetchDeviceMetrics';
// import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
// import getApiRoot             from '../_helpers/getApiRoot';

// const addDevice = device => (dispatch, getState) => {
//   const url = getApiRoot() + '/api/v1/registeredDevice';
//
//   console.log('posting device', device);
//
//   const options = {
//     method : 'POST',
//     body   : R.compose(JSON.stringify, R.defaultTo({}))(device)
//   };
//
//   return fetch(url, makeCommonFetchOptions(options))
//     .then(jsonOrError('Add a hardware device'))
//     .then(res => {
//       dispatch(fetchDeviceMetrics());
//     })
//     .catch(handleError);
// };
//
// export default addDevice;
