import fetchRewards from './fetchRewardsThunk';
import saveReward   from './saveReward';
import addReward    from './addReward';
import deleteReward from './deleteReward';

const resources = {
  fetchRewards : {
    uri    : '/api/v1/reward/',
    method : 'GET'
  },
  saveReward   : {
    uri    : '/api/v1/reward/id/:id',
    method : 'PUT'
  },
  addReward   : {
    uri    : '/api/v1/reward/',
    method : 'POST'
  }
};

export {
  resources,
  fetchRewards,
  saveReward,
  addReward,
  deleteReward,
}
