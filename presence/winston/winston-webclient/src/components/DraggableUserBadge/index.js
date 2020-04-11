import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { connect }          from 'react-redux';

import './style.css';

import UserBadge                from '../../components/UserBadge';
import DraggableItem            from '../../components/DraggableItem';
import DraggableBadgeRemoveIcon from '../../components/DraggableBadgeRemoveIcon';

const mapStateToProps = (state, ownProps) => ({ ...state.App });

class DraggableUserBadge extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hovered  : false,
      dragging : false
    };
  }

  onMouseDown(e) {
    const clickedRemoveBadge = e.target.getAttribute('data-id') === 'remove-x';

    if (!clickedRemoveBadge) {
      this.setState({ dragging : true });
    }
  }

  onMouseUp() {
    this.setState({ dragging : false });
  }

  onMouseOver() {
    this.setState({ hovered : true });
  }

  onMouseLeave() {
    this.setState({ hovered : false });
  }

  isHovered() {
    return this.props.onRemove && this.state.hovered && !this.state.dragging;
  }

  render() {
    const { props } = this;

    return (
      <div
        className    = "DraggableUserBadge"
        onMouseOver  = {() => this.onMouseOver()}
        onMouseLeave = {() => this.onMouseLeave()}
        onMouseDown  = {e =>  this.onMouseDown(e)}
        onMouseUp    = {() => this.onMouseUp()}
      >
        <DraggableItem
          element   = {<UserBadge user={props.user}/>}
          name      = {props.user.email}
          props     = {props}
          user      = {props.user}
          className = {props.className}
          style     = {props.style}
          value     = {props.user.id}
          title     = {`${props.user.firstName} ${props.user.lastName}`}
          beginDrag = {props.beginDrag}
        />
        {
          (this.isHovered()) ? (
            <DraggableBadgeRemoveIcon onRemove={props.onRemove}/>
          ) : null
        }
      </div>
    );
  }
}

const propTypes = {
  user : PropTypes.shape({
    email     : PropTypes.string,
    firstName : PropTypes.string,
    lastName  : PropTypes.string,
    portrait  : PropTypes.string
  }),
  beginDrag   : PropTypes.func,
  className   : PropTypes.string,
  style       : PropTypes.object,
  onRemove    : PropTypes.func
};

DraggableUserBadge.propTypes = propTypes;

export default connect(
  mapStateToProps
)(DraggableUserBadge);
