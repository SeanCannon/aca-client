import * as R from 'ramda';

export default {
  'CloudUserSearch.searchField'        : (state, action) => R.assoc('cloudUserSearchField', action.data)(state),
  'CloudUserSearch.searchTerm'         : (state, action) => R.assoc('cloudUserSearchTerm',  action.data)(state),
  'service.CloudUser.searchCloudUsers' : (state, action) => {
    const data = R.compose(
      R.pluck('_source'),
      R.pathOr([], ['data', 'hits', 'hits'])
    )(action);
    return R.assoc('cloudUserSearchResults', data, state);
  }
};
