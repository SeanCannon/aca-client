import * as R      from 'ramda';
import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.App });

const UserBadge = props => (
  <div
    className = {`UserBadge ${props.className}`}
    onClick   = {e => props.onClick ? props.onClick(R.assocPath(['target', 'value'], props.user, e)) : ''}
  >
    <img alt       = ""
         src       = {props.user.portrait}
         className = "UserBadge-portrait"
         title     = {`${props.user.firstName} ${props.user.lastName}`}
    /> <span>{props.user.firstName} {props.user.lastName}</span>
  </div>
);

const propTypes = {
  user : PropTypes.shape({
    email     : PropTypes.string,
    firstName : PropTypes.string,
    lastName  : PropTypes.string,
    portrait  : PropTypes.string
  }),
  style       : PropTypes.object,
  onClick     : PropTypes.func,
  className   : PropTypes.string
};

UserBadge.propTypes = propTypes;

export default connect(
  mapStateToProps
)(UserBadge);
