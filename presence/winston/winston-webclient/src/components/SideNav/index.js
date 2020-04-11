import * as R            from 'ramda';
import React             from 'react';
import { Link }          from 'react-router-dom';
import { Nav, NavItem }  from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect }       from 'react-redux';

import { logout } from '../../services/Auth';
import logo       from '../../images/logo-b.png';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.App, ...state.RBACService });

const setFocusedPage = props => pageName => {
  props.dispatch({
    type : `app.setFocusedPage`,
    data : pageName
  });
};

const SideNav = props => {

  const cachedProfile    = window.sessionStorage.getItem('profile');
  const profile          = R.tryCatch(JSON.parse, R.always(null))(cachedProfile);
  const maybeActiveClass = (a, b) => a === b ? 'active' : '';

  return (
    <div className="SideNav">
      <Link to="/"><img src={logo} className="SideNav-logo" alt="logo"/></Link>

      <h4>{ props.tenancy.tenant.title }</h4>

      { props.tenancy.tenantLocation.title && <h4 style={{ fontStyle : 'italic'}}>{ props.tenancy.tenantLocation.title }</h4> }

      <section className="SideNav-profile">
        { profile && profile.portrait && <img className="SideNav-user-portrait" src={profile.portrait} alt="portrait" /> }
        { profile && <h4>{ profile.firstName } { profile.lastName }</h4>}
      </section>

      <h3>Dashboard</h3>
      { props.permission && (
        <Nav>

          { props.permission[`/api/v1/tenantMember/:GET`] &&
            <LinkContainer to="/dashboard/members">
              <NavItem
                eventKey={2}
                className={maybeActiveClass(props.focusedPage, '/dashboard/members')}
                onClick={() => setFocusedPage(props)('/dashboard/members') }
              >Members</NavItem>
            </LinkContainer>
          }

        </Nav>
      )}
      <h3>Account</h3>
      <Nav>
        { props.permission && props.permission[`/api/v1/tenantAccessRole/:GET`] &&
          <LinkContainer to="/dashboard/roles">
            <NavItem
              eventKey={4}
              className={maybeActiveClass(props.focusedPage, '/dashboard/permissions')}
              onClick={() => setFocusedPage(props)('/dashboard/permissions') }
            >Permissions</NavItem>
          </LinkContainer>
        }
        <LinkContainer to="#">
          <NavItem eventKey={5} onClick={() => logout(props)}>Logout</NavItem>
        </LinkContainer>
      </Nav>
    </div>
  );
};

export default connect(
  mapStateToProps
)(SideNav);
