import React, { Component }              from 'react';
import * as R                            from 'ramda';
import { connect }                       from 'react-redux';
import cuid                              from 'cuid';
import { Grid, Row, Col, Modal, Button } from 'react-bootstrap';

import CloudUserSearch                   from '../../../components/CloudUserSearch';
import DropTarget                        from '../../../components/DropTarget';
import DraggableUserBadge                from '../../../components/DraggableUserBadge';
import DraggableResourceBadge            from '../../../components/DraggableResourceBadge';
import TenantAccessRoleSection           from '../../../components/TenantAccessRoleSection';
import CreateTenantAccessRoleForm        from '../../../components/CreateTenantAccessRoleForm';

import { searchCloudUsersThunk }         from '../../../services/CloudUser';

import {
  maybeCreateTenantAccessPermission,
  maybeCreateTenantAccessRoleAssignment,
  fetchTenantAccessRoles
} from '../../../services/RBAC';

import './style.css';

const TENANT_LOCATION_RESOURCE_ACTIVE_STATUS = 1,
      TENANT_ACCESS_ROLE_ACTIVE_STATUS       = 1;

const mapStateToProps = (state, ownProps) => ({ ...state.RBACDashboard, ...state.App });

const applyToRole = (props, role) => ({ droppedItem }) => {

  if (R.has('user', droppedItem)) {
    props.dispatch(maybeCreateTenantAccessRoleAssignment({
      tenantAccessRoleId : role.id,
      cloudUserId        : droppedItem.user.id
    }));
    props.dispatch(searchCloudUsersThunk(props.cloudUserSearchField)(''));
    props.dispatch({
      type : 'CloudUserSearch.searchTerm',
      data : ''
    });
  }

  if (R.has('resource', droppedItem)) {
    props.dispatch(maybeCreateTenantAccessPermission({
      tenantAccessRoleId     : role.id,
      tenantAccessResourceId : droppedItem.resource.id
    }));
  }

};

const makeUserListElements = R.compose(
  R.map(({ cloudUser }) => (
    <DraggableUserBadge
      key  = {cuid()}
      user = {cloudUser}
    />
  )),
  R.uniqBy(R.path(['cloudUser', 'id'])),
  R.filter(R.pathEq(['cloudUser', 'status'], 1)),
  R.propOr([], 'tenantAccessRoleAssignments')
);

const makeResourceListElements = R.compose(
  R.map(resource => (
    <DraggableResourceBadge
      key      = {cuid()}
      resource = {resource}
    />
  )),
  R.sort(R.ascend(R.prop('title'))),
  R.filter(R.propEq('status', TENANT_LOCATION_RESOURCE_ACTIVE_STATUS)),
  R.propOr([], 'tenantAccessResources')
);

const makeRoleSections = props => R.compose(
  R.map(role => (
    <DropTarget
      key    = {cuid()}
      onDrop = {applyToRole(props, role)}
    >
      <TenantAccessRoleSection
        tenantAccessRole            = {role}
        tenantAccessResources       = {props.tenantAccessResources}
        tenantAccessRoleAssignments = {props.tenantAccessRoleAssignments}
        tenantAccessPermissions     = {props.tenantAccessPermissions}
      />
    </DropTarget>
  )),
  R.filter(R.propEq('status', TENANT_ACCESS_ROLE_ACTIVE_STATUS)),
  R.propOr([], 'tenantAccessRoles')
)(props);

class RBACDashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showEditRoleModal   : false,
      showCreateRoleModal : false,
      showStaffPool       : true,
      showResourcePool    : true,
      calculatedHeights   : {},
      childNodes          : {}
    };
  }

  toggleCreateRoleModal(bool) {
    this.setState({ showCreateRoleModal : bool });
  }

  toggleEditRoleModal(bool) {
    this.setState({ showEditRoleModal : bool });
  }

  toggleCollapsed(flag) {
    this.setState({ [flag] : !this.state[flag]});
  }

  maybeCollapsed(flag) {
    return this.state[flag] ? '' : 'collapsed';
  }

  getCalculatedListHeightStyle(id) {
    if (this.state.calculatedHeights[id]) {
      return { height : this.state.calculatedHeights[id] }
    }  else {
      return {}
    }
  }

  getCalculatedGridColumnHeightStyle() {
    return {
      height : this.props.dashboardViewport.height - 50
    }
  }

  componentDidUpdate() {
    let calculatedHeights = R.clone(this.state.calculatedHeights);

    document.querySelectorAll('.RBACDashboard-collapsible-select-list').forEach(item => {
      let innerHeight = 0;
      const childNodesCount = this.state.childNodes[item.id];

      if (item.childNodes.length !== childNodesCount) {
        item.childNodes.forEach(child => {
          innerHeight += child.getBoundingClientRect().height;
        });
        calculatedHeights[item.id] = innerHeight + 20;
      }
    });

    if (!R.equals(this.state.calculatedHeights, calculatedHeights)) {
      this.setState(R.assoc('calculatedHeights', calculatedHeights, this.state));
    }
  }

  render() {

    const { props } = this;

    return (
      <div className="RBACDashboard">
        <Grid>
          <Row>
            <Col id="RBACDashboard-pools-column" className="RBACDashboard-column" md={3} sm={3} style={this.getCalculatedGridColumnHeightStyle()}>

              <CloudUserSearch/>

              <h4 className="RBACDashboard-toggle-title" onClick={() => this.toggleCollapsed('showStaffPool')}>Staff Pool</h4>
              <div
                id        = "RBACDashboardStaffPool"
                className = {`RBACDashboard-collapsible-select-list ${this.maybeCollapsed('showStaffPool')}`}
                style     = {this.getCalculatedListHeightStyle('RBACDashboardStaffPool')}
              >
                {makeUserListElements(props)}
              </div>

              <h4 className="RBACDashboard-toggle-title" onClick={() => this.toggleCollapsed('showResourcePool')}>Resource Pool</h4>
              <div
                id        = "RBACDashboardResourcePool"
                className = {`RBACDashboard-collapsible-select-list ${this.maybeCollapsed('showResourcePool')}`}
                style     = {this.getCalculatedListHeightStyle('RBACDashboardResourcePool')}
              >
                {makeResourceListElements(props)}
              </div>

            </Col>
            <Col id="RBACDashboard-roles-column" className="RBACDashboard-column" md={9} sm={9} style={this.getCalculatedGridColumnHeightStyle()}>
              <div className="RBACDashboard-role-sections">
                <Button
                  className="RBACDashboard-create-role-button"
                  onClick={() => this.toggleCreateRoleModal(true)}
                >
                  Create a new Role
                </Button>
                <div className="clearfix"/>
                {makeRoleSections(props)}
              </div>
            </Col>
          </Row>
        </Grid>

        <Modal
          className={`regular`}
          show={this.state.showCreateRoleModal}
          onHide={() => this.toggleCreateRoleModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create A New Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreateTenantAccessRoleForm
              onCreateTenantAccessRole={res => {
                props.dispatch(fetchTenantAccessRoles());
                this.toggleCreateRoleModal(false);
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(RBACDashboard);
