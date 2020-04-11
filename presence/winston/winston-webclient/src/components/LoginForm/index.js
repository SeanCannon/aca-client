import * as R                                                            from 'ramda';
import prr                                                               from 'prettycats';
import React, { Component }                                              from 'react';
import { connect }                                                       from 'react-redux';
import { Col, Row, FormGroup, FormControl, ControlLabel, Button, Alert } from 'react-bootstrap';

import { login }            from '../../services/Auth';
import { forgotPassword }   from '../../services/PasswordReset';

import './style.css';
import { store } from '../../store';

// TODO Add an onClick handler to the submit button so if any of these still fail it'll select
// TODO the appropriate input and animate it somehow, like a quick grow/shrink bounce or something.
const getValidationState = R.prop(R.__, {
  email    : R.ifElse(prr.isEmail, R.always('success'), R.always('error')),
  password : R.ifElse(prr.isStringOfLengthAtLeast(10), R.always('success'), R.always('error'))
});

const mapStateToProps = (state, ownProps) => ({ ...state.App });

const maybeProvideTenantContext = tenancy => {
  if (tenancy.tenant.title) {
    if (tenancy.tenantLocation.title) {
      return `to ${tenancy.tenant.title} ${tenancy.tenantLocation.title}`;
    } else {
      return `to ${tenancy.tenant.title}`;
    }
  } else {
    return '';
  }
};

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email          : '',
      password       : '',
      errorMessage   : null,
      successMessage : null,
      ...props
    }
  }

  showLoginErrorOrSuccess(data) {
    if (data.err) {
      this.setState({ errorMessage : 'Cannot verify credentials. Please re-enter your email and password and try again. If you need help, contact <a href="mailto:support@winstonretail.com">Support@WinstonRetail.com</a>.'})
    } else {
      this.setState({ errorMessage : null, successMessage : `Success! Logged in as ${data.email}. Redirecting...` });
      return data;
    }
  }

  login(email, password) {
    return login(email, password, this.props.onLogin)
      .then(R.prop('data'))
      .then(this.showLoginErrorOrSuccess.bind(this))
      .catch(console.error)
  }

  handleForgotPassword() {
    const { email } = this.state;

    forgotPassword(email)
      .then(() => {
        store.dispatch({
          type : 'app.notify',
          data : {
            message  : `An email has been sent to ${email} with password reset instructions.`,
            severity : 'success'
          }
        });
      });
  }

  render() {
    const setFieldState = path => e => this.setState(R.assocPath(path, e.target.value, this.state));

    return (
      <div className="LoginForm">
        <h1>Login { maybeProvideTenantContext(this.props.tenancy) }</h1>
        { this.state.errorMessage   && <Alert bsStyle="danger"><span dangerouslySetInnerHTML={{ __html : this.state.errorMessage }}/></Alert> }
        { this.state.successMessage && <Alert bsStyle="success">{ this.state.successMessage }</Alert> }
        <Row>
          <Col md={4} sm={4} xs={12}>
            <FormGroup controlId="email" bsSize="large" validationState={getValidationState('email')(this.state.email)}>
              <ControlLabel>Email</ControlLabel>
              <FormControl componentClass="input" type="email" onChange={setFieldState(['email'])}
                           placeholder="" value={ this.state.email }/>
            </FormGroup>
          </Col>
          <Col md={4} sm={4} xs={12}>
            <FormGroup controlId="password" bsSize="large" validationState={getValidationState('password')(this.state.password)}>
              <ControlLabel>Password</ControlLabel>
              <FormControl componentClass="input" type="password" onChange={setFieldState(['password'])}
                           placeholder="" value={ this.state.password }/>
            </FormGroup>
          </Col>
          <Col md={4} sm={4} xs={12}>
            <FormGroup controlId="password" bsSize="large" validationState={getValidationState('password')(this.state.password)}>
              {
                this.state.email ? (
                  <ControlLabel><a onClick={e => this.handleForgotPassword()}>Forgot password?</a></ControlLabel>
                ) : <ControlLabel><a>&nbsp;</a></ControlLabel>
              }
              <Button bsSize="large" className="pull-right btn-primary" onClick={e => this.login(this.state.email, this.state.password, this.props.redirectTo)}>Login</Button>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(LoginForm);
