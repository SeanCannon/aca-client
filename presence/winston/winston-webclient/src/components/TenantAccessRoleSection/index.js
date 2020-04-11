import * as R             from 'ramda';
import cuid               from 'cuid';
import React              from 'react';
import { connect }        from 'react-redux';
import PropTypes          from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';

import './style.css';

import DraggableUserBadge     from '../DraggableUserBadge';
import DraggableResourceBadge from '../DraggableResourceBadge';

import {
  maybeDeleteTenantAccessPermission,
  maybeDeleteTenantAccessRoleAssignment
} from '../../services/RBAC';

const mapStateToProps = (state, ownProps) => ({...state.App});

const propTypes = {
  tenantAccessResources       : PropTypes.array,
  tenantAccessRoleAssignments : PropTypes.array,
  tenantAccessRolePermissions : PropTypes.array,
  tenantAccessRole            : PropTypes.shape({
    id    : PropTypes.number,
    title : PropTypes.string
  })
};

const makeCloudUserBadges = props => R.map(({ id, cloudUser }) => (
  <DraggableUserBadge
    user     = {cloudUser}
    key      = {cuid()}
    onRemove = {() => props.dispatch(maybeDeleteTenantAccessRoleAssignment(id))}
  />
));

const makeTenantAccessResourceBadges = props => R.map(({ id, tenantAccessResource }) => (
  <DraggableResourceBadge
    resource = {tenantAccessResource}
    key      = {cuid()}
    onRemove = {() => props.dispatch(maybeDeleteTenantAccessPermission(id))}
  />
));

const filterThisRoleOnly = props => R.filter(R.propEq('tenantAccessRoleId', props.tenantAccessRole.id));

const TenantAccessRoleSection = props => (
  <section className="TenantAccessRoleSection">
    <Row>
      <Col md={12} sm={12}>
        <h3>{props.tenantAccessRole.title}</h3>
      </Col>
    </Row>
    <Row>
      <Col md={6} sm={6}>
        <h4>Assigned Staff</h4>
        {
          R.compose(
            makeCloudUserBadges(props),
            filterThisRoleOnly(props)
          )(props.tenantAccessRoleAssignments)
        }
      </Col>
      <Col md={6} sm={6}>
        <h4>Allowed Resources</h4>
        {
          R.compose(
            makeTenantAccessResourceBadges(props),
            filterThisRoleOnly(props)
          )(props.tenantAccessPermissions)
        }
      </Col>
    </Row>

  </section>
);

export default connect(
  mapStateToProps
)(TenantAccessRoleSection);

TenantAccessRoleSection.propTypes = propTypes;
