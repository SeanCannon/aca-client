import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchCloudUserById = id => {
  const url = getApiRoot() + '/api/v1/cloudUser/id/' + id;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('Fetch a user profile'))
    .catch(handleError);
};

export default fetchCloudUserById;
