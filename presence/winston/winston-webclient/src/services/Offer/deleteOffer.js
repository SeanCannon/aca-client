import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const deleteOffer = id => {
  const url = getApiRoot() + '/api/v1/offer/id/' + id;

  const fetchOptions = {
    method  : 'DELETE'
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Delete a promotional offer'))
    .catch(handleError);

};

export default deleteOffer;
