import fetchFloorPlan from './fetchFloorPlanThunk';
import syncFloorPlan  from './syncFloorPlanThunk';

const resources = {
  fetchFloorPlan : {
    uri    : '/api/v1/tenantLocation/id/:id',
    method : 'GET'
  },
  syncFloorPlan  : {
    uri    : '/api/v1/tenantLocation/id/:id',
    method : 'PUT'
  }
};

export {
  resources,
  fetchFloorPlan,
  syncFloorPlan
};
