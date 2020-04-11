import * as R from 'ramda';

export default {
  'service.RBAC.fetchTenantAccessRoles'           : (state, action) => R.assoc('tenantAccessRoles',           action.data)(state),
  'service.RBAC.fetchTenantAccessRoleAssignments' : (state, action) => R.assoc('tenantAccessRoleAssignments', action.data)(state),
  'service.RBAC.fetchTenantAccessPermissions'     : (state, action) => R.assoc('tenantAccessPermissions',     action.data)(state),
  'service.RBAC.fetchTenantAccessResources'       : (state, action) => R.assoc('tenantAccessResources',       action.data)(state),
  'RBACDashboard.showCreateRoleModal'             : (state, action) => R.assoc('showCreateRoleModal',         action.data)(state),
  'RBACDashboard.showEditRoleModal'               : (state, action) => R.assoc('showEditRoleModal',           action.data)(state)
};
