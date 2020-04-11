import React, { Component } from 'react';
import * as R               from 'ramda';
import { Redirect }         from 'react-router'
import { connect }          from 'react-redux';
import PropTypes            from 'prop-types';
import { Link }             from 'react-router-dom';

import PasswordResetForm from '../../../components/PasswordResetForm';
import HeaderNav         from '../../../components/HeaderNav/index';
import FooterNav         from '../../../components/FooterNav/index';

import './style.css';

const mapStateToProps = (state, ownProps) => ({...state.App });

const propTypes = {
  tenancy : PropTypes.shape({
    tenant : PropTypes.shape({
      domain : PropTypes.string
    })
  }),
  hasReset : PropTypes.bool
};

class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      tenantAccessRole : {
        tenantId         : props.tenancy.tenant.id,
        tenantLocationId : props.tenancy.tenantLocation.id
      },
      hasReset : false
    }
  }

  onPasswordReset() {
    this.setState({ hasReset : true })
  }

  render() {
    const { props } = this;
    return (
      <div className="PasswordReset">
        <HeaderNav/>
        <section className="PasswordReset-form-container">
          {
            props.hasReset
            ? <p>Your password has been reset. You may <Link to={'/'}>login now</Link></p>
            : <PasswordResetForm tenancy={props.tenancy} onPasswordReset={() => this.onPasswordReset()}/>
          }
        </section>
        <FooterNav/>

      </div>
    );
  }
}

PasswordReset.propTypes = propTypes;

export default connect(
  mapStateToProps
)(PasswordReset);
