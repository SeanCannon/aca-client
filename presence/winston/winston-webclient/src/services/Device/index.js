//import addDevice          from './addDeviceThunk';
import fetchDevices       from './fetchDevicesThunk';
import fetchDeviceMetrics from './fetchDeviceMetricsThunk';
import syncDevice         from './syncDeviceThunk';

const resources = {
  fetchDevices : {
    uri    : '/api/v1/registeredDevice/',
    method : 'GET'
  },
  syncDevice   :  {
    uri    : '/api/v1/registeredDevice/id/:id',
    method : 'PUT'
  }
};

export {
  resources,
  //addDevice,
  fetchDevices,
  fetchDeviceMetrics,
  syncDevice
}
