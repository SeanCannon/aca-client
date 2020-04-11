/// api/v1/search/index/cloudusers/type/clouduser/field/firstName/q/ca

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const searchCloudUsersThunk = field => query => (dispatch, getState) => {
  const url = `${getApiRoot()}/api/v1/search/index/cloudusers/type/clouduser/field/${field}/q/${query}`;

  if (query.length) {
    return fetch(url, makeCommonFetchOptions())
      .then(jsonOrError('Search users'))
      .then(res => {
        dispatch({
          type : 'service.CloudUser.searchCloudUsers',
          data : res.data
        });
        return res;
      })
      .catch(handleError);
  } else {
    dispatch({
      type : 'service.CloudUser.searchCloudUsers',
      data : []
    });
  }
};

export default searchCloudUsersThunk;
