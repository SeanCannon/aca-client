import React                     from 'react';
import * as R                    from 'ramda';
import cuid                      from 'cuid';
import { connect }               from 'react-redux';
import { FormGroup, Radio }      from 'react-bootstrap';
import changeCase                from 'change-case';
import PropTypes                 from 'prop-types';

import { searchCloudUsersThunk } from '../../services/CloudUser';
import UserBadge                 from '../../components/UserBadge';
import DraggableUserBadge        from '../../components/DraggableUserBadge';

import scrollToTop               from '../../utils/scrollToTop';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.CloudUserSearch, ...state.App });

const _searchCloudUsers = props => query => {
  props.dispatch({
    type : 'CloudUserSearch.searchTerm',
    data : query
  });
  props.dispatch(searchCloudUsersThunk(props.cloudUserSearchField)(query));
};

const setCloudUserSearchField = props => field => {
  props.dispatch({
    type : 'CloudUserSearch.searchField',
    data : field
  });
  props.dispatch(searchCloudUsersThunk(field)(props.cloudUserSearchTerm));
};

const maybeCallParentOnSelect = (props, e) => {
  if (R.is(Function, props.onSelect)) {
    props.onSelect(e);
  }
};

const CloudUserSearch = props => {

  props.cloudUserSearchResults.length && setTimeout(() => {
    scrollToTop(document.getElementById('CloudUserSearch-results'), 200);
  }, 50);

  return (
    <div className={`CloudUserSearch ${props.className}`}>
      <FormGroup className="CloudUserSearch-form-group" controlId="cloudUserSearchField" bsSize="large">

        <input
          id          = "CloudUserSearch-input"
          className   = "CloudUserSearch-search-term"
          type        = "search"
          onChange    = {e => _searchCloudUsers(props)(e.target.value)}
          value       = {props.cloudUserSearchTerm}
          placeholder = {`Lookup cloud user by ${changeCase.sentenceCase(props.cloudUserSearchField)}`}
        />

        <div className="CloudUserSearch-cloud-user-search-types">
          {
            R.map(field => (

              <Radio
                onChange = {() => setCloudUserSearchField(props)(field)}
                key      = {cuid()}
                name     = {field}
                checked  = {props.cloudUserSearchField === field}
                inline
              >
                {changeCase.sentenceCase(field)}&nbsp;
              </Radio>

            ))(['email', 'firstName', 'lastName'])
          }
        </div>
      </FormGroup>

      {
        props.cloudUserSearchResults.length ? (
          <div id="CloudUserSearch-results" className="CloudUserSearch-results">
            {
              R.map(user => (
                props.draggable === true ?
                  <DraggableUserBadge
                    key       = {cuid()}
                    user      = {user}
                    className = "CloudUserSearch-result"
                  /> :
                  <UserBadge
                    key       = {cuid()}
                    user      = {user}
                    className = "CloudUserSearch-result"
                    onClick   = { e => { maybeCallParentOnSelect(props, e); _searchCloudUsers({ ...props, cloudUserSearchField : 'email' })('') } }
                  />
              ))(props.cloudUserSearchResults)
            }
          </div>
        ) : null
      }
    </div>
  );
};


const propTypes = {
  cloudUserSearchField   : PropTypes.string,
  cloudUserSearchTerm    : PropTypes.string,
  cloudUserSearchResults : PropTypes.array,
  onSelect               : PropTypes.func,
  draggable              : PropTypes.bool
};

CloudUserSearch.propTypes = propTypes;

export default connect(
  mapStateToProps
)(CloudUserSearch);
