import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchMembers = () => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/tenantMember';

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all members'))
    .then(res => {
      dispatch({
        type : 'service.Member.fetchMembers',
        data : res.data
      });
      return res;
    })
    .catch(handleError);
};

export default fetchMembers;
