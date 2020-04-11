import React        from 'react';
import * as R       from 'ramda';
import { Redirect } from 'react-router'
import { connect }  from 'react-redux';

import LoginForm from '../../../components/LoginForm';
import HeaderNav from '../../../components/HeaderNav/index';
import FooterNav from '../../../components/FooterNav/index';

import { maybeLoginWithRefreshToken } from '../../../services/Auth';

import './style.css';

const BASE64_ENCODED_ROOT_PATH = 'Lw=='; // "/"

const whereTo = R.compose(
  v => atob(v),
  R.pathOr(BASE64_ENCODED_ROOT_PATH, ['match', 'params', 'redirectTo'])
);

const mapStateToProps = (state, ownProps) => ({...state.App});

const setLoggedIn = props => bool => {
  props.dispatch({
    type : 'app.session',
    data : { loggedIn : bool }
  });
};

const Login = props => (
  <div className="Login">

    { props.session.loggedIn && <Redirect to={whereTo(props)}/> }

    { maybeLoginWithRefreshToken(() => setLoggedIn(props)(true)) }

    <HeaderNav/>
    <section className="Login-form-container">
      <LoginForm tenancy={props.tenancy} onLogin={() => setLoggedIn(props)(true)}/>
    </section>
    <FooterNav/>

  </div>
);

export default connect(
  mapStateToProps
)(Login);
