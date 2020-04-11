import * as R                           from 'ramda';
import React                            from 'react';
import { connect }                      from 'react-redux';
import { Link }                         from 'react-router-dom';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import { LinkContainer }                from 'react-router-bootstrap';
import PropTypes                        from 'prop-types';

import logo from '../../images/logo-b.png';

import './style.css';

const mapStateToProps = (state, ownProps) => ({...state.App});

const isTenantDomain = R.compose(R.not, R.pathEq(['tenancy', 'tenant', 'domain'], 'www'));

const propTypes = {
  tenancy  : PropTypes.shape({
    tenant  : PropTypes.shape({
      domain : PropTypes.string
    })
  })
};

const HeaderNav = props =>
  <div className="HeaderNav">
    <Navbar inverse collapseOnSelect fixedTop>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/"><img src={logo} className="HeaderNav-logo" alt="logo"/></Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          { isTenantDomain(props) }
          {
            isTenantDomain(props) &&
            <LinkContainer className="HeaderNav-nested-link" to="/dashboard">
              <NavItem eventKey={1}>Dashboard</NavItem>
            </LinkContainer>
          }
          <LinkContainer className="HeaderNav-nested-link" to="/support">
            <NavItem eventKey={2}>Support</NavItem>
          </LinkContainer>
          {
            !isTenantDomain(props) &&
            <LinkContainer className="HeaderNav-nested-link" to="/welcome-health-club-manager">
              <NavItem eventKey={3}>
                <Button className="HeaderNav-request-demo">Request a Demo</Button>
              </NavItem>
            </LinkContainer>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>;

HeaderNav.propTypes = propTypes;

export default connect(
  mapStateToProps
)(HeaderNav);
