import * as R from 'ramda';

export default {
  'service.Upload.uploadImage' : (state, action) => R.assocPath(['tenantMember', 'portrait'], action.data)(state)
};
