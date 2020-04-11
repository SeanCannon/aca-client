import * as R                 from 'ramda';
import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const login = (email, password, onLogin) => {
  const url = getApiRoot() + '/auth/login';

  const maybeCallback = R.ifElse(R.path(['data', 'err']), R.identity, onLogin);

  const fetchOptions = {
    method : 'POST',
    mode   : 'cors',
    body   : R.compose(JSON.stringify, R.defaultTo({}))({
      email,
      password
    })
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Login'))
    .then(maybeCallback)
    .catch(handleError);
};

export default login;
