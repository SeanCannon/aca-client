import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { DragLayer }        from 'react-dnd';

const layerStyles = {
  position      : 'fixed',
  pointerEvents : 'none',
  zIndex        : 100,
  left          : 0,
  top           : 0,
  width         : '100%',
  height        : '100%'
};

const getItemStyles = props => {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display : 'none'
    };
  }

  const { x, y }  = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform       : transform,
    WebkitTransform : transform
  };
};

class CustomDragLayer extends Component {
  render() {
    const { name, element, isDragging } = this.props;

    return isDragging ? (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          <div className={this.props.className} style={{ ...this.props.style }}>
            {element || name}
          </div>
        </div>
      </div>
    ) : null;
  }
}

CustomDragLayer.propTypes = {
  item          : PropTypes.object,
  itemType      : PropTypes.string,
  currentOffset : PropTypes.shape({
    x : PropTypes.number.isRequired,
    y : PropTypes.number.isRequired
  }),
  isDragging    : PropTypes.bool.isRequired
};

const collect = monitor => {
  return {
    item          : monitor.getItem(),
    itemType      : monitor.getItemType(),
    currentOffset : monitor.getSourceClientOffset(),
    isDragging    : monitor.isDragging()
  };
};

export default DragLayer(collect)(CustomDragLayer);
