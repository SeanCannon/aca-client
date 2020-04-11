import * as R from 'ramda';

export default {
  'service.RBAC.checkTenantAccessPermission' : (state, action) => R.assocPath(['permission', action.data.resource], action.data.permission)(state)
};
