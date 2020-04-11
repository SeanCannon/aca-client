import React             from 'react';
import { Nav, NavItem }  from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect }       from 'react-redux';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.App, ...state.RBACService });

const OverviewDashboard = props =>
  <div className="OverviewDashboard">
    Dashboards overview here.. What to do?
  </div>;

export default connect(
  mapStateToProps
)(OverviewDashboard);

