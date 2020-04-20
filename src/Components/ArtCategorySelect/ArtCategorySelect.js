import * as R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Dropdown } from 'semantic-ui-react';

const StyledDropdown = Styled(Dropdown)`
  border: solid 1px rgba(247, 218, 177, 0.8);
  padding: 10px 25px;
  border-radius: 25px;
  
  div.menu > div.item > span.text {
    font-size: 24px;
  }
`;

const categories = {
  met : [
    {
      value : { departmentId : 1 },
      key   : 'American Decorative Arts',
      text  : 'American Decorative Arts'
    },
    {
      value : { departmentId : 3 },
      key   : 'Ancient Near Eastern Art',
      text  : 'Ancient Near Eastern Art'
    },
    {
      value : { departmentId : 4 },
      key   : 'Arms and Armor',
      text  : 'Arms and Armor'
    },
    {
      value : { departmentId : 5 },
      key   : 'Arts of Africa, Oceania, and the Americas',
      text  : 'Arts of Africa, Oceania, and the Americas'
    },
    {
      value : { departmentId : 6 },
      key   : 'Asian Art',
      text  : 'Asian Art'
    },
    {
      value : { departmentId : 7 },
      key   : 'The Cloisters',
      text  : 'The Cloisters'
    },
    {
      value : { departmentId : 8 },
      key   : 'The Costume Institute',
      text  : 'The Costume Institute'
    },
    {
      value : { departmentId : 9 },
      key   : 'Drawings and Prints',
      text  : 'Drawings and Prints'
    },
    {
      value : { departmentId : 10 },
      key   : 'Egyptian Art',
      text  : 'Egyptian Art'
    },
    {
      value   : { departmentId : 11 },
      default : true,
      key     : 'European Paintings',
      text    : 'European Paintings'
    },
    {
      value : { departmentId : 12 },
      key   : 'European Sculpture and Decorative Arts',
      text  : 'European Sculpture and Decorative Arts'
    },
    {
      value : { departmentId : 13 },
      key   : 'Greek and Roman Art',
      text  : 'Greek and Roman Art'
    },
    {
      value : { departmentId : 14 },
      key   : 'Islamic Art',
      text  : 'Islamic Art'
    },
    {
      value : { departmentId : 15 },
      key   : 'The Robert Lehman Collection',
      text  : 'The Robert Lehman Collection'
    },
    {
      value : { departmentId : 16 },
      key   : 'The Libraries',
      text  : 'The Libraries'
    },
    {
      value : { departmentId : 17 },
      key   : 'Medieval Art',
      text  : 'Medieval Art'
    },
    {
      value : { departmentId : 18 },
      key   : 'Musical Instruments',
      text  : 'Musical Instruments'
    },
    {
      value : { departmentId : 19 },
      key   : 'Photographs',
      text  : 'Photographs'
    },
    {
      value : { departmentId : 21 },
      key   : 'Modern Art',
      text  : 'Modern Art'
    }
  ]
};

const ArtCategorySelect = ({ strategy, onSelect }) => (
  <span>
    <StyledDropdown
      inline
      scrolling
      onChange={(_, { value }) => onSelect(value)}
      options={categories[strategy]}
      defaultValue={
        R.compose(
          R.prop('value'),
          R.defaultTo({}),
          R.find(R.propEq('default', true)),
          R.prop(strategy)
        )(categories)
      }
    />
  </span>
);

ArtCategorySelect.propTypes = {
  strategy : PropTypes.string,
  onSelect : PropTypes.func
};

export default ArtCategorySelect;
