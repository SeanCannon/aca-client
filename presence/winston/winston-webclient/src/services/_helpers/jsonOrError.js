const maybeUpdateTokensInKeychain = res => {
  const authToken    = res.headers.get('X-auth-token'),
        refreshToken = res.headers.get('X-refresh-token');

  authToken    && window.sessionStorage.setItem('auth-token',    authToken);
  refreshToken && window.sessionStorage.setItem('refresh-token', refreshToken);
};

const maybeCacheSessionUserProfile = res => {
  const profile = res.headers.get('X-profile');

  profile && window.sessionStorage.setItem('profile', profile);
};

const jsonOrError = resourceName => res => {

  if (res.status === 401) {
    window.location = `/login/${btoa(window.location.pathname)}`;
  } else if (res.status === 403) {
    let err = new Error();
    err.raw     = res;
    err.message = `Permission denied for ${resourceName}`;
    throw err;

  } else if (res.status >= 400) {
    let err = new Error();
    err.raw     = res;
    err.message = `Bad response from server`;
    throw err;
  } else {

    maybeUpdateTokensInKeychain(res);
    maybeCacheSessionUserProfile(res);

    return res.json();
  }
};

export default jsonOrError;
