import * as R                                                 from 'ramda';
import React, { Component }                                   from 'react';
import { connect }                                            from 'react-redux';
import { FormGroup, FormControl, ControlLabel, Button, Modal} from 'react-bootstrap';

import { saveRole, deleteRole } from '../../services/Roles';

import './style.css';

const save = props => (originalRole, stateRole) => {
  const saveData = R.pickBy((v, k) => originalRole[k] !== stateRole[k], stateRole);
  console.log('saveData = ', saveData);
  saveRole(originalRole.id, saveData)
    .then(props.onSaveRole)
};

const mapStateToProps = (state, ownProps) => ({ ...state.App });

class EditRoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props, maybeDelete : false }
  }

  maybeDeleteModal() {
   return (
     <Modal
       className={ `regular` }
       show={ true }
       onHide={e => {this.setState({ maybeDelete : false })}}
     >
       <Modal.Header closeButton>
         <Modal.Title>Confirm Delete</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         Are you sure?
         <Button
           className="pull-right btn-danger"
           onClick={e => deleteRole(this.props.reward.id).then(() => this.props.onDeleteRole())}>
           Confirm Delete
         </Button>
         <div className="clearfix"></div>
       </Modal.Body>
     </Modal>
   );
  }

  render() {
    const setFieldState = path => e => this.setState(R.assocPath(path, e.target.value, this.state));

    return (
      <div className="EditRoleForm">

        <FormGroup controlId="title" bsSize="large">
          <ControlLabel>Title</ControlLabel>
          <FormControl componentClass="input" onChange={setFieldState(['reward', 'title'])}
                       placeholder="Title" value={ this.state.reward.title }/>
        </FormGroup>

        <FormGroup controlId="description" bsSize="large">
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={setFieldState(['reward', 'description'])}
                       placeholder="Description..." value={ this.state.reward.description }/>
        </FormGroup>

        <FormGroup controlId="upc" bsSize="large">
          <ControlLabel>UPC</ControlLabel>
          <FormControl componentClass="input" onChange={setFieldState(['reward', 'upc'])}
                       placeholder="" value={ this.state.reward.upc }/>
        </FormGroup>

        <FormGroup controlId="quantity" bsSize="small">
          <ControlLabel>Qty</ControlLabel>
          <FormControl componentClass="input" type="number" onChange={setFieldState(['reward', 'quantity'])}
                       placeholder="Inventory quantity" value={ this.state.reward.quantity }/>
        </FormGroup>

        <FormGroup controlId="points" bsSize="small">
          <ControlLabel>Points</ControlLabel>
          <FormControl componentClass="input" type="number" onChange={setFieldState(['reward', 'points'])}
                       placeholder="Points needed to earn this reward" value={ this.state.reward.points }/>
        </FormGroup>

        <Button className="pull-left btn-success" onClick={e => save(this.props)(this.props.reward, this.state.reward)}>Save Changes</Button>
        <Button className="pull-right btn-danger" onClick={e => this.setState({ maybeDelete : true })}>Delete</Button>

        <div className="clearfix" />
        {
          console.log('maybeDelete = ', this.state.maybeDelete)
        }
        { this.state.maybeDelete && this.maybeDeleteModal() }
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(EditRoleForm);
