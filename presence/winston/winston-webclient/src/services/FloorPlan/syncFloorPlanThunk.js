import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const syncFloorPlan = floorplan => (dispatch, getState) => {

  const tenantLocationId = R.path(['App', 'tenancy', 'tenantLocation', 'id'], getState());
  const url              = `${getApiRoot()}/api/v1/tenantLocation/id/${tenantLocationId}`;

  const fetchOptions = {
    method : 'PUT',
    body   : JSON.stringify({ floorplan })
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Save floor plan details'))
    .then(res => {
      let fp;
      try {
        fp = JSON.parse(res.data.floorplan)
      } catch (e) {
        console.log('service.FloorPlan.syncFloorPlan Error:', e, res.data.floorplan);
      }
      dispatch({
        type : 'service.FloorPlan.syncFloorPlan',
        data : fp
      });
      return res;
    })
    .catch(handleError);
};

export default syncFloorPlan;
