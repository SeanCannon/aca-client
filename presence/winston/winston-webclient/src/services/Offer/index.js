import fetchOffers from './fetchOffersThunk';
import saveOffer   from './saveOffer';
import addOffer    from './addOffer';
import deleteOffer from './deleteOffer';

const resources = {
  fetchOffers : {
    uri    : '/api/v1/offer/',
    method : 'GET'
  },
  saveOffer   : {
    uri    : '/api/v1/offer/id/:id',
    method : 'PUT'
  },
  addOffer   : {
    uri    : '/api/v1/offer/',
    method : 'POST'
  }
};

export {
  resources,
  fetchOffers,
  saveOffer,
  addOffer,
  deleteOffer,
}
