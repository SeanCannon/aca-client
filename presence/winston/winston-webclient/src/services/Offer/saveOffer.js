import * as R from 'ramda';

import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const saveOffer = (id, updateData) => {
  const url = getApiRoot() + '/api/v1/offer/id/' + id;

  const fetchOptions = {
    method : 'PUT',
    body   : R.compose(JSON.stringify, R.defaultTo({}))(updateData)
  };

  return fetch(url, makeCommonFetchOptions(fetchOptions))
    .then(jsonOrError('Update promotional offer details'))
    .catch(handleError);

};

export default saveOffer;
