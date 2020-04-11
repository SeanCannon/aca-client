import * as R                               from 'ramda';
import React, { Component }                 from 'react';
import { Grid, Row, Col, Tabs, Tab }        from 'react-bootstrap';
import { Route, Router, Switch, Redirect }  from 'react-router'
import { connect }                          from 'react-redux';

import SideNav           from '../../components/SideNav';
import MembersDashboard  from './Members';
import OverviewDashboard from './Overview';
import RBACDashboard     from './RBAC';

import { getAuthToken }                               from '../../services/Auth';
import { fetchDevices, resources as deviceResources } from '../../services/Device';
import { fetchMembers, resources as memberResources } from '../../services/Member';

import {
  checkTenantAccessPermission,
  fetchTenantAccessRoles,
  fetchTenantAccessRoleAssignments,
  fetchTenantAccessResources,
  fetchTenantAccessPermissions,
  resources as RBACResources
} from '../../services/RBAC';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.App });

let resizeThrottleTimeout;

const maybeRedirectToLogin = () => {
  if (!getAuthToken()) {
    window.location = `/login/${btoa(window.location.pathname)}`;
    return false;
  } else {
    return true;
  }
};

const onWindowResize = props => e => {
  const container = document.querySelectorAll('.Dashboard-content-column')[0];

  clearTimeout(resizeThrottleTimeout);
  resizeThrottleTimeout = setTimeout(() => {
    if (container) {
      props.dispatch({
        type : 'app.resizeDashboard',
        data : {
          height : container.clientHeight,
          width  : container.clientWidth
        }
      });
    } else {
      window.removeEventListener('resize', onWindowResize(props));
    }
  }, 100);

};

const onDashboardTabSelect = (props, dashboard) => eventKey => {
  props.dispatch({
    type : `app.${dashboard}DashboardTabFocus`,
    data : eventKey
  });
};

class Dashboard extends Component {
  componentWillMount() {
    const { props } = this;
    const storedProfile  = window.sessionStorage.getItem('profile');

    window.addEventListener('resize', onWindowResize(this.props));

    if (storedProfile) {
      const cloudUserId = JSON.parse(storedProfile).id;

      R.compose(
        R.map(({ uri, method }) => props.dispatch(checkTenantAccessPermission(uri, method, cloudUserId))),
        R.flatten,
        R.map(R.values)
      )([
        memberResources,
        deviceResources,
        RBACResources
      ]);
    }

  }

  render() {
    const { props } = this;

    const isLoggedIn = maybeRedirectToLogin();

    return isLoggedIn && (
      <div className="Dashboard">
        <Grid>
          <Row>
            <Col md={2} sm={2} className="Dashboard-sidenav-column">
              <SideNav history={props.history}/>
            </Col>
            <Col md={10} sm={10} className="Dashboard-content-column">
              <p style={{ textAlign : 'right' }}>
                <span style={{ marginRight : 10 }}>Current Version : 1.0.1 (Latest)</span>
                {
                  // some condition here...
                  <a href="#" title="Update Winston Retail Dashboards">New Version Available (1.0.4): Update Now</a>
                }
              </p>
              <Router history={props.history}>
                <Switch>
                  <Route path='/dashboard/roles' component={
                    class DevicesDashboardResolver extends Component {
                      componentWillMount() {
                        props.dispatch(fetchTenantAccessRoles());
                        props.dispatch(fetchTenantAccessResources());
                        props.dispatch(fetchTenantAccessPermissions());
                        props.dispatch(fetchTenantAccessRoleAssignments());
                      }

                      render() {
                        return (
                          <RBACDashboard/>
                        );
                      }
                    }
                  }/>
                  <Route path='/dashboard/members' component={
                    class MembersDashboardResolver extends Component {
                      componentWillMount() {
                        props.dispatch(fetchDevices());
                        props.dispatch(fetchMembers());
                      }

                      render() {
                        return <MembersDashboard onSaveMember={ () => props.dispatch(fetchMembers()) }/>;
                      }
                    }
                  }/>
                  <Route path='/dashboard/overview' component={OverviewDashboard}/>
                  <Redirect from="/dashboard" to="/dashboard/overview"/>
                </Switch>
              </Router>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  componentDidMount() {
    onWindowResize(this.props)();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', onWindowResize(this.props));
  }
}

export default connect(
  mapStateToProps
)(Dashboard);
