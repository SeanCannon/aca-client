import * as R                 from 'ramda';
import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const getRefreshToken    = () => window.sessionStorage.getItem('refresh-token');
const removeRefreshToken = () => window.sessionStorage.removeItem('refresh-token');

const maybeLoginWithRefreshToken = onLogin => {
  const url          = getApiRoot() + '/auth/refresh',
        refreshToken = getRefreshToken();

  const fetchOptions = {
    method : 'POST',
    mode   : 'cors',
    body   : R.compose(JSON.stringify, R.defaultTo({}))({
      refreshToken
    })
  };

  if (refreshToken) {
    removeRefreshToken();
    fetch(url, makeCommonFetchOptions(fetchOptions))
      .then(jsonOrError('Login with refresh token'))
      .then(onLogin)
      .catch(handleError);
  }

  return null;
};

export default maybeLoginWithRefreshToken;
