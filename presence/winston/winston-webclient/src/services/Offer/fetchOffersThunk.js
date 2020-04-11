
import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeCommonFetchOptions from '../_helpers/makeCommonFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const fetchOffers = () => (dispatch, getState) => {

  const url = `${getApiRoot()}/api/v1/offer`;

  return fetch(url, makeCommonFetchOptions())
    .then(jsonOrError('List all promotional offers'))
    .then(res => {
      dispatch({
        type : 'service.Offer.fetchOffers',
        data : res.data
      });
      return res;
    })
    .catch(handleError);
};

export default fetchOffers;
