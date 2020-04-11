import React from 'react';

const logout = props => {
  window.localStorage.clear();
  window.sessionStorage.clear();

  props.dispatch({
    type : 'app.session',
    data : { loggedIn : false }
  });
};

export default logout;
