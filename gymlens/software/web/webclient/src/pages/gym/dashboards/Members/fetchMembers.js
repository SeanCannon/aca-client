'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const FAKE_DEMO_TENANT_ID = 4;

const getMembers = () => {
  return dispatch => {
    try {
      return fetch('http://localhost:1337/api/v1/tenantMembers/tenantId/' + FAKE_DEMO_TENANT_ID)
        .then(res => {
          if (res.status >= 400) {
            throw new Error("Bad response from server");
          }
          return res.json();
        })
        .then(res => {
          dispatch({
            type : "getMembers",
            data : res
          });
        });
    } catch (e) {
      console.error("Exception caught in getMembers action: ", e);
    }
  };
};

export default getMembers;
