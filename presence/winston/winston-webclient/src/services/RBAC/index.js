import fetchTenantAccessRoles                from './fetchTenantAccessRolesThunk';
import fetchTenantAccessRoleAssignments      from './fetchTenantAccessRoleAssignmentsThunk';
import fetchTenantAccessResources            from './fetchTenantAccessResourcesThunk';
import fetchTenantAccessResourceById         from './fetchTenantAccessResourceById';
import fetchTenantAccessPermissions          from './fetchTenantAccessPermissionsThunk';
import checkTenantAccessPermission           from './checkTenantAccessPermissionThunk';
import maybeCreateTenantAccessPermission     from './maybeCreateTenantAccessPermissionThunk';
import maybeDeleteTenantAccessPermission     from './maybeDeleteTenantAccessPermissionThunk';
import maybeCreateTenantAccessRoleAssignment from './maybeCreateTenantAccessRoleAssignmentThunk';
import maybeDeleteTenantAccessRoleAssignment from './maybeDeleteTenantAccessRoleAssignmentThunk';

import createTenantAccessRole                from './createTenantAccessRole';
import saveTenantAccessRole                  from './saveTenantAccessRole';

const resources = {
  fetchTenantAccessRoles : {
    uri    : '/api/v1/tenantAccessRole/',
    method : 'GET'
  },
  fetchTenantAccessRoleById : {
    uri    : '/api/v1/tenantAccessRole/id/:id',
    method : 'GET'
  },
  createTenantAccessPermission : {
    uri    : '/api/v1/tenantAccessPermission/',
    method : 'POST'
  },
  createTenantAccessRoleAssignment : {
    uri    : '/api/v1/tenantAccessRoleAssignment/',
    method : 'POST'
  }
};

export {
  resources,

  fetchTenantAccessRoles,
  fetchTenantAccessRoleAssignments,
  fetchTenantAccessResources,
  fetchTenantAccessResourceById,
  fetchTenantAccessPermissions,
  checkTenantAccessPermission,
  maybeCreateTenantAccessPermission,
  maybeCreateTenantAccessRoleAssignment,
  maybeDeleteTenantAccessPermission,
  maybeDeleteTenantAccessRoleAssignment,

  saveTenantAccessRole,
  createTenantAccessRole
};
