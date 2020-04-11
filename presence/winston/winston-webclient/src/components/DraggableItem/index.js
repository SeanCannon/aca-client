import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { DragSource }       from 'react-dnd';

const boxSource = {
  beginDrag(props, monitor, component) {

    if (typeof props.beginDrag === 'function') {
      props.beginDrag(props, monitor, component);
    }

    return { name : props.name, ...props.props };
  },

  endDrag(props, monitor, component) {},
};

function collect(connect, monitor) {
  return {
    connectDragSource : connect.dragSource(),
    isDragging        : monitor.isDragging(),
  };
}

const propTypes = {
  connectDragSource : PropTypes.func.isRequired,
  isDragging        : PropTypes.bool.isRequired,
  name              : PropTypes.string.isRequired,
  element           : PropTypes.element
};

class DraggableItem extends Component {
  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name, element }                 = this.props;
    const opacity                           = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div className={this.props.className} style={{ opacity, ...this.props.style }}>
          {element || name}
        </div>,
      )
    );
  }
}

DraggableItem.propTypes = propTypes;

export default DragSource('box', boxSource, collect)(DraggableItem);
