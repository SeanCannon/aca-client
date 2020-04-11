import fetchMembers        from './fetchMembersThunk';
import fetchMemberActivity from './fetchMemberActivityThunk';
import saveMember          from './saveMember';

const resources = {
  fetchMembers  : {
    uri    : '/api/v1/tenantMember/',
    method : 'GET'
  },
  createMember  : {
    uri    : '/api/v1/tenantMember/',
    method : 'POST'
  },
  saveMember    : {
    uri    : '/api/v1/tenantMember/id/:id',
    method : 'PUT'
  },
  saveCloudUser : {
    uri    : '/api/v1/cloudUser/id/:id',
    method : 'PUT'
  }
};

export {
  resources,
  fetchMembers,
  fetchMemberActivity,
  saveMember
};
