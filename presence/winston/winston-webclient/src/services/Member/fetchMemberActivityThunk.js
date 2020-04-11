import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

/**
 * @example moment().hours(-1).format('x'); // '1492572481764'
 *          http://gutfit.gymlens.test/api/v1/lensMetrics/memberActivity/{"where":{"r":"Sk1VyuxAx","t":{"$gte":1492569765000,"$lt":1492569765089}}}
 * @param memberTag
 * @param from
 * @param to
 */
const fetchMemberActivity = (memberTag, from, to) => (dispatch, getState) => {
  const url = `${getApiRoot()}/api/v1/lensMetrics/memberActivity/{"where":{"m":"${memberTag}","t":{"$gte":${from},"$lt":${to}}},"limit":99999999}`;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('Fetch member activity'))
    .then(R.prop('data'))
    .then(res => {
      dispatch({
        type : 'service.Member.fetchMemberActivity',
        data : res
      });
      return res;
    })
    .catch(handleError);
};

export default fetchMemberActivity;
