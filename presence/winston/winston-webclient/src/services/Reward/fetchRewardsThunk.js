import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchRewards = () => (dispatch, getState) => {
  const url = `${getApiRoot()}/api/v1/reward`;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all rewards'))
    .then(res => {
      dispatch({
        type : 'service.Reward.fetchRewards',
        data : res.data
      });
      return res;
    })
    .catch(handleError);
};

export default fetchRewards;
