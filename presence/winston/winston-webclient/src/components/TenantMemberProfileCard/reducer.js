import * as R from 'ramda';

export default {
  'TenantMemberProfileCard.setFocusedView' : (state, action) => R.assoc('focusedView', action.data)(state)
};
