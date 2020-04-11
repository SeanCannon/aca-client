import * as R   from 'ramda';
import React    from 'react';
import { Cell } from 'fixed-data-table';

import './style.css';

const getOtherSortDir = d => d === 'ascend' ? 'descend' : 'ascend';

const arrow = R.prop(R.__, {
  ascend  : <i className="glyphicon glyphicon-triangle-top"/>,
  descend : <i className="glyphicon glyphicon-triangle-bottom"/>
});

const isNumeric = str => !isNaN(parseInt(str, 10));

// TODO ONLY SORTING BY STRINGS AND POINTS ARE NUMBERS AND NOT GETTING SORTED CORRECTLY
const SortableTableHeader = props =>
  <Cell className="MembersDashboard-table-header"
        onClick={() => props.sort(props.sortKeys, getOtherSortDir(props.sortDir)) }>
    { props.children } { R.equals(props.sortBy, props.sortKeys) && arrow(props.sortDir) }
  </Cell>;

export default SortableTableHeader;
