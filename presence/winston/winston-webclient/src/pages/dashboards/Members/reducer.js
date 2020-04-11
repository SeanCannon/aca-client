import * as R from 'ramda';

export default {
  'service.Member.fetchMembers'         : (state, action) => R.assoc('members',                action.data)(state),
  'service.Member.fetchMemberActivity'  : (state, action) => R.assoc('selectedMemberActivity', action.data)(state),
  'service.Device.fetchDevices'         : (state, action) => R.assoc('devices',                action.data)(state),
  'MembersDashboard.setSelectedMember'  : (state, action) => R.assoc('selectedMember',         action.data)(state)
};
