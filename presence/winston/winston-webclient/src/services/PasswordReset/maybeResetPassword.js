import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';
import * as R                 from 'ramda';

const maybeResetPassword = data => {
  const url = getApiRoot() + `/api/v1/passwordReset/maybeResetPassword`;

  const fetchOptions = {
    method : 'POST',
    mode   : 'cors',
    body   : R.compose(JSON.stringify, R.defaultTo({}))(data)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('PasswordReset'))
    .catch(handleError);

};

export default maybeResetPassword;
