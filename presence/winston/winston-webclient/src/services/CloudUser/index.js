import fetchCloudUserById    from './fetchCloudUserById';
import searchCloudUsersThunk from './searchCloudUsersThunk';

const resources = {
  fetchCloudUserById  : {
    uri    : '/api/v1/cloudUser/:id',
    method : 'GET'
  }
};

export {
  resources,
  fetchCloudUserById,
  searchCloudUsersThunk
};
