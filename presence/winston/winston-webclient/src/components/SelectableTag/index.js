import React from 'react';

import './style.css';

const maybeSelected = props => props.selected ? 'selected' : '';

const SelectableTag = props => (
  <div className={'SelectableTag ' + maybeSelected(props)} onClick={props.onClick}>
    { props.children }
  </div>
);

export default SelectableTag;
