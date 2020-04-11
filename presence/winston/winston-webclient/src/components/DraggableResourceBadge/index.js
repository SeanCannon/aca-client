import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { connect }          from 'react-redux';

import './style.css';

import DraggableItem            from '../../components/DraggableItem';
import DraggableBadgeRemoveIcon from '../../components/DraggableBadgeRemoveIcon';

const mapStateToProps = (state, ownProps) => ({ ...state.App });

const ResourceBadge = props => (
  <div className="ResourceBadge">
    <span>{props.resource.title}</span>
  </div>
);

class DraggableResourceBadge extends Component {

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
        className    = "DraggableResourceBadge"
        onMouseOver  = {() => this.onMouseOver()}
        onMouseLeave = {() => this.onMouseLeave()}
        onMouseDown  = {e =>  this.onMouseDown(e)}
        onMouseUp    = {() => this.onMouseUp()}
      >
        <DraggableItem
          element   = { <ResourceBadge resource={props.resource} /> }
          name      = {props.resource.title}
          props     = {props}
          resource  = {props.resource}
          className = {props.className}
          style     = {props.style}
          value     = {props.resource.id}
          title     = {props.resource.title}
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
  style       : PropTypes.object
};

DraggableResourceBadge.propTypes = propTypes;
ResourceBadge.propTypes          = propTypes;

export default connect(
  mapStateToProps
)(DraggableResourceBadge);
