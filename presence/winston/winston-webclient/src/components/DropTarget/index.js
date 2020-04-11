import React, { Component } from 'react';
import ReactDOM             from 'react-dom';
import PropTypes            from 'prop-types';
import { DropTarget }       from 'react-dnd';

const ensureAtLeastZero = n => n < 0 ? 0 : n;

const boxTarget = {
  drop(props, monitor, dropTarget) {

    const droppedItem        = monitor.getItem();
    const dropTargetPosition = ReactDOM.findDOMNode(dropTarget).getBoundingClientRect();
    const droppedItemOffset  = monitor.getSourceClientOffset();

    const dropX = ensureAtLeastZero(droppedItemOffset.x - dropTargetPosition.left);
    const dropY = ensureAtLeastZero(droppedItemOffset.y - dropTargetPosition.top);

    const result = {droppedItem, dropTarget, position : { x : dropX, y : dropY }};

    if (typeof props.onDrop === 'function') {
      props.onDrop(result);
    }

    return result;
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget : connect.dropTarget(),
    isOver            : monitor.isOver(),
    canDrop           : monitor.canDrop(),
  };
}

const propTypes = {
  connectDropTarget : PropTypes.func.isRequired,
  isOver            : PropTypes.bool.isRequired,
  canDrop           : PropTypes.bool.isRequired,
};

class Target extends Component {
  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive                               = canDrop && isOver;

    const TRANSLUCENT_GREEN   = 'rgba(0, 240, 0, 0.7)',
          TRANSLUCENTER_GREEN = 'rgba(0, 240, 0, 0.3)';

    let backgroundColor = '';

    if (isActive) {
      backgroundColor = this.props.activeBackgroundColor  || TRANSLUCENT_GREEN;
    } else if (canDrop) {
      backgroundColor = this.props.canDropBackgroundColor || TRANSLUCENTER_GREEN;
    }

    return connectDropTarget(
      <div className={this.props.className} style={{ backgroundColor }} >
        { this.props.children }
      </div>,
    );
  }
}

Target.propTypes = propTypes;

export default DropTarget('box', boxTarget, collect)(Target);
