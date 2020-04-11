import * as R                  from 'ramda';
import moment                  from 'moment';
import React, { Component }    from 'react';
import cuid                    from 'cuid';
import { connect }             from 'react-redux';
import { Table, Column, Cell } from 'fixed-data-table';

import constants               from '../../../constants';
import { TextCell }            from '../../../components/FixedDataTableCellTypes';
import TenantMemberProfileCard from '../../../components/TenantMemberProfileCard';
import SortableTableHeader     from '../../../components/SortableTableHeader';

import './style.css';

const mapStateToProps = (state, ownProps) => ({ ...state.MembersDashboard, ...state.App });

const statuses = ['Inactive', 'Active'];

let cache = {};

const selectMember = props => member => {
  props.dispatch({
    type : 'MembersDashboard.setSelectedMember',
    data : member
  });
};

const transformRowForTable = props => row => {
  return {
    id              : cuid(),
    select          : <input type="checkbox" name="selectedMembers"/>,
    portrait        : <img alt="" src={ row.portrait } className="MembersDashboard-portrait" />,
    name            : <a onClick={e => selectMember(props)(row)}>{`${row.firstName} ${row.lastName}`}</a>,
    firstName       : row.firstName,
    lastName        : row.lastName,
    email           : row.email,
    referenceId     : row.referenceId,
    pointsBalance   : row.pointsBalance,
    status          : statuses[row.status],
    timestamp       : row.timestamp,
    timestampMoment : moment(row.timestamp).fromNow()
  };
};

const transformApiResponseForTable = props => R.map(transformRowForTable(props));

const maybeShowSelectedMemberCard = props => {
  if (props.selectedMember.firstName) {
    return <TenantMemberProfileCard
             member={props.selectedMember}
             devices={props.devices}
             memberActivity={props.selectedMemberActivity}
             onBackClick={e => selectMember(props)({})}
             onSaveMember={e => {
               props.onSaveMember();
               selectMember(props)({});
             }}
           />;
  }

  return null;
};

const maybeShowMembersTable = (props, state, sort, search) => {

  if (props.members && props.members.length) {
    const firstMemberTimestamp = R.path(['members', 0, 'timestamp']);

    let data = (firstMemberTimestamp(props) === firstMemberTimestamp(cache)) ? cache.members : transformApiResponseForTable(props)(props.members);

    cache.members = data;

    if (state.searchTerm) {
      data = R.filter(R.compose(R.test(new RegExp(state.searchTerm, 'gi')), R.props(['firstName', 'lastName', 'email', 'referenceId'])))(data);
    }

    data = R.sort(R[state.sortDir](R.props(state.sortBy)), data);

    return (
      <div style={{ filter : props.selectedMember.firstName ? 'blur(5px)' : 'none' }}>
        <input className="MembersDashboard-search" type="search" onChange={search} placeholder="Filter by name, email, or reference id" />
        <Table
          rowHeight={60}
          headerHeight={44}
          rowsCount={data.length}
          width={props.dashboardViewport.width - 30}
          height={props.dashboardViewport.height - 100}>
          <Column
            header={<Cell></Cell>}
            cell={<TextCell data={data} col="portrait"/>}
            fixed={true}
            width={60}
          />
          <Column
            header={<SortableTableHeader sort={sort} sortBy={state.sortBy} sortDir={state.sortDir}
                                         sortKeys={['lastName', 'firstName']}>Name</SortableTableHeader>}
            cell={<TextCell data={data} col="name"/>}
            flexGrow={1}
            width={150}
          />
          <Column
            header={<SortableTableHeader sort={sort} sortBy={state.sortBy} sortDir={state.sortDir} sortKeys={['email']}>Email</SortableTableHeader>}
            cell={<TextCell data={data} col="email"/>}
            flexGrow={2}
            width={200}
          />
          <Column
            header={<SortableTableHeader sort={sort} sortBy={state.sortBy} sortDir={state.sortDir}
                                         sortKeys={['referenceId']}>Reference ID</SortableTableHeader>}
            cell={<TextCell data={data} col="referenceId"/>}
            flexGrow={1}
            width={120}
          />
          <Column
            header={<SortableTableHeader sort={sort} sortBy={state.sortBy} sortDir={state.sortDir}
                                         sortKeys={['pointsBalance']}>Points</SortableTableHeader>}
            cell={<TextCell data={data} col="pointsBalance"/>}
            flexGrow={1}
            width={60}
          />
          <Column
            header={<SortableTableHeader sort={sort} sortBy={state.sortBy} sortDir={state.sortDir}
                                         sortKeys={['status']}>Status</SortableTableHeader>}
            cell={<TextCell data={data} col="status"/>}
            flexGrow={1}
            width={50}
          />
          <Column
            header={<SortableTableHeader sort={sort} sortBy={state.sortBy} sortDir={state.sortDir}
                                         sortKeys={['timestamp']}>Last Updated</SortableTableHeader>}
            cell={<TextCell data={data} col="timestampMoment"/>}
            flexGrow={1}
            width={150}
          />
        </Table>
      </div>
    );
  }

  return <div className="MembersDashboard-no-data-prompt">
    <p>Members will appear here once they are enrolled.</p>
    <p>Call us at { constants.gymlens.phone } for assistance.</p>
  </div>;
};


// TODO FIX SORTING BECAUSE NUMERIC VALUES ARE BEING SORTED WEIRD - POINTS BALANCE, ETC
class MembersDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { sortBy : ['lastName', 'firstName'], sortDir : 'ascend', searchTerm : ''}
  }

  componentWillMount() {}

  search(e) {
    this.setState({ searchTerm : e.target.value });
  }

  sortByColumn(sortBy, sortDir) {
    this.setState({ sortBy, sortDir });
  }

  render() {
    return <div>
      { maybeShowSelectedMemberCard(this.props) }
      { maybeShowMembersTable(this.props, this.state, this.sortByColumn.bind(this), this.search.bind(this)) }
    </div>
  }
}

export default connect(
  mapStateToProps
)(MembersDashboard);
