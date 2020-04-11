import React    from 'react';
import { Cell } from 'fixed-data-table';

export const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

export const DateCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col].toLocaleString()}
  </Cell>
);

// exports.ImageCell = ({rowIndex, data, col, ...props}) => (
//   <ExampleImage
//     src={data.getObjectAt(rowIndex)[col]}
//   />
// );

// exports.LinkCell = ({rowIndex, data, col, ...props}) => (
//   <Cell {...props}>
//     <a href="#">{data.getObjectAt(rowIndex)[col]}</a>
//   </Cell>
// );
