import enrollTenantMember from './enrollTenantMember';
import linkCloudUser      from './linkCloudUser';

const resources = {
  enrollTenantMember : {
    uri    : '/api/v1/tenantMember/enroll/',
    method : 'POST'
  },
  linkCloudUser : {
    uri    : '/api/v1/tenantMember/link/',
    method : 'POST'
  }
};

export {
  resources,
  enrollTenantMember,
  linkCloudUser
};
