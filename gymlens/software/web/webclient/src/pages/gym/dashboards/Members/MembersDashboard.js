import React, { Component } from 'react';

import { connect }  from 'react-redux';
import './Members.css';

const mapStateToProps = (state, ownProps) => ({
  members : state.members
});

const Members = props =>
  <div className="Members">
    member management stuff...
  </div>;

const MembersContainer = connect(
  mapStateToProps
)(Members);

export default MembersContainer;
