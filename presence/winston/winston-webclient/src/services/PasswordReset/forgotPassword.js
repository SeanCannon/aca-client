import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const forgotPassword = email => {
  const url = getApiRoot() + `/api/v1/passwordReset/email/${email}`;

  const fetchOptions = {
    method : 'GET'
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Forgot password'))
    .catch(handleError);
};

export default forgotPassword;
