import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.App });

const DraggableBadgeRemoveIcon = props => (
  <div className="DraggableBadgeRemoveIcon" >
    <div onClick={props.onRemove} data-id="remove-x">X</div>
  </div>
);

export default connect(
  mapStateToProps
)(DraggableBadgeRemoveIcon);
