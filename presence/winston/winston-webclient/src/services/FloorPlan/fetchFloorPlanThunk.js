import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchFloorPlan = () => (dispatch, getState) => {

  const tenantLocationId = R.path(['App', 'tenancy', 'tenantLocation', 'id'], getState());
  const url              = `${getApiRoot()}/api/v1/tenantLocation/id/${tenantLocationId}`;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('Fetch location floor plan'))
    .then(res => {
      dispatch({
        type : 'service.FloorPlan.syncFloorPlan',
        data : JSON.parse(res.data.floorplan)
      });
      return res;
    })
    .catch(handleError);
};

export default fetchFloorPlan;
