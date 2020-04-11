import * as R                                                  from 'ramda';
import React, { Component }                                    from 'react';
import { connect }                                             from 'react-redux';
import { FormGroup, FormControl, ControlLabel, Button, Radio } from 'react-bootstrap';

import { createTenantAccessRole } from '../../services/RBAC';

import './style.css';

const add = props => data => createTenantAccessRole(data).then(props.onCreateTenantAccessRole);

const mapStateToProps = (state, ownProps) => ({ ...state.App });

class CreateTenantAccessRoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      tenantAccessRole : {
        tenantId         : props.tenancy.tenant.id,
        tenantLocationId : props.tenancy.tenantLocation.id
      }
    }
  }

  render() {
    const setFieldState = path => e => this.setState(R.assocPath(path, e.target.value, this.state));

    return (
      <div className="CreateTenantAccessRoleForm">

        <FormGroup controlId="title" bsSize="large">
          <FormControl componentClass="input" onChange={setFieldState(['tenantAccessRole', 'title'])}
                       placeholder="Role Title" value={this.state.tenantAccessRole.title}/>
        </FormGroup>

        <Button className="pull-left btn-success" onClick={e => add(this.props)(this.state.tenantAccessRole)}>Confirm</Button>

        <div className="clearfix"/>

      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(CreateTenantAccessRoleForm);
