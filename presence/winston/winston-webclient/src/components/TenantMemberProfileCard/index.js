import * as R                                                            from 'ramda';
import cuid                                                              from 'cuid';
import moment                                                            from 'moment';
import React, { Component }                                              from 'react';
import { connect }                                                       from 'react-redux';
import DatePicker                                                        from 'react-bootstrap-date-picker';
import { Table, Column, Cell }                                           from 'fixed-data-table';
import { Col, Row, FormGroup, FormControl, ControlLabel, Radio, Button } from 'react-bootstrap';

import { TextCell }                        from '../../components/FixedDataTableCellTypes';
import { fetchMemberActivity, saveMember } from '../../services/Member';

import './style.css';

let cache = {};

const adjustWidthForViewport = width => Math.floor(width * .66);

let resizeThrottleTimeout;

const setFocusedView = props => view => props.dispatch({
  type : 'TenantMemberProfileCard.setFocusedView',
  data : view
});

const onWindowResize = props => () => {
  const container = document.getElementById('TenantMemberProfileCard');

  clearTimeout(resizeThrottleTimeout);
  resizeThrottleTimeout = setTimeout(() => {
    if (container) {
      props.dispatch({
        type : 'app.resizeTenantMemberProfileCard',
        data : {
          height : container.clientHeight,
          width  : adjustWidthForViewport(container.clientWidth)
        }
      });
    } else {
      window.removeEventListener('resize', onWindowResize(props));
    }
  }, 100);

};

const mapStateToProps = (state, ownProps) => ({ ...state.App, ...state.TenantMemberProfileCard });

const save = props => (originalMember, stateMember) => {
  const saveData = R.pickBy((v, k) => originalMember[k] !== stateMember[k], stateMember);
  console.log('saveData = ', saveData);
  saveMember(originalMember.cloudUserId, originalMember.id, saveData)
    .then(props.onSaveMember)
};

const makeDateFromRowKey = R.compose(
  d => moment(d).format('MM/DD/YYYY'),
  parseInt,
  R.last,
  R.split('-')
);

const getZoneNameFromReaderTag = readerTag => R.compose(
  R.prop('placement'),
  JSON.parse,
  R.prop('metaJson'),
  R.find(R.propEq('rfidTagId', readerTag)),
  R.prop('devices')
);

const transformRowForTable = props => (groupedData, dateKey, o) => {
  const memberTag = props.member.referenceId;
  return R.compose(
    R.values,
    R.mapObjIndexed((data, readerTag) => ({
        id   : cuid(),
        memberTag,
        readerTag,
        zone : getZoneNameFromReaderTag(readerTag)(props),
        date : makeDateFromRowKey(dateKey),
        from : moment(data[0]).format('h:mm A'),
        to   : moment(data[1]).format('h:mm A')
      })
    ))(groupedData);
};

const transformApiResponseForTable = props => R.compose(
  R.flatten,
  R.values,
  R.mapObjIndexed(transformRowForTable(props))
);

const maybeShowMemberActivity = props => {
  const memberHasActivity = R.compose(R.length, R.keys, R.prop('memberActivity'))(props);

  if (memberHasActivity) {
    const data = cache.memberActivity || transformApiResponseForTable(props)(props.memberActivity);

    cache.memberActivity = data;

    return (
      <Table
        rowHeight={60}
        headerHeight={44}
        rowsCount={data.length}
        width={props.tenantMemberProfileCardViewport.width - 30}
        height={props.tenantMemberProfileCardViewport.height - 50}>
        <Column
          header={<Cell>Date</Cell>}
          cell={<TextCell data={data} col="date"/>}
          flexGrow={1}
          width={100}
        />
        <Column
          header={<Cell>Zone</Cell>}
          cell={<TextCell data={data} col="zone"/>}
          flexGrow={1}
          width={200}
        />
        <Column
          header={<Cell>From</Cell>}
          cell={<TextCell data={data} col="from"/>}
          flexGrow={2}
          width={200}
        />
        <Column
          header={<Cell>To</Cell>}
          cell={<TextCell data={data} col="to"/>}
          flexGrow={1}
          width={120}
        />
      </Table>
    );
  }

  return null;
};

class TenantMemberProfileCard extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }

  componentWillMount() {
    window.addEventListener('resize', onWindowResize(this.props));
  }

  render() {
    const setFieldState         = path => e => this.setState(R.assocPath(path, e.target.value, this.state));
    const memberProp            = prop => R.path(['state', 'member', prop], this);
    const profileViewIsFocused  = this.props.focusedView === 'profile';
    const activityViewIsFocused = this.props.focusedView === 'activity';

    return (
      <div id="TenantMemberProfileCard" className="TenantMemberProfileCard">
        <form>
          <Row>
            <Col id="TenantMemberProfileCard-avatar-column" md={4} sm={4} style={{ textAlign : 'center' }}>
              <h4 onClick={this.state.onBackClick} style={{ textAlign : 'left' }}><a>Back</a></h4>
              <img className="TenantMemberProfileCard-portrait" src={memberProp('portrait')} alt="portrait"/>
              <h5 className="TenantMemberProfileCard-points-label">Current Reward Points</h5>
              <h4 className="TenantMemberProfileCard-points-value">{memberProp('pointsBalance')}</h4>

              {
                profileViewIsFocused

                  ? <a onClick={() => {
                    const to   = moment().format('x');
                    const from = moment().subtract(1, 'months').format('x');

                    setFocusedView(this.props)('activity');
                    this.props.dispatch(fetchMemberActivity(memberProp('referenceId'), from, to));
                  }} className="TenantMemberProfileCard-view-activity-button">View Activity</a>

                  : <a onClick={() => {
                    setFocusedView(this.props)('profile');
                  }} className="TenantMemberProfileCard-view-activity-button">View Profile</a>
              }

            </Col>

            {
              profileViewIsFocused &&
                <Col md={4} sm={4}>
                  <h2>Details</h2>

                  <FormGroup controlId="firstName" bsSize="large">
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'firstName'])}
                                 placeholder="First Name" value={memberProp('firstName')}/>
                  </FormGroup>

                  <FormGroup controlId="lastName" bsSize="large">
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'lastName'])}
                                 placeholder="Last Name" value={memberProp('lastName')}/>
                  </FormGroup>

                  <FormGroup controlId="birthday" bsSize="large">
                    <ControlLabel>DOB</ControlLabel>
                    <DatePicker
                      onChange={v => v ? setFieldState(['member', 'birthday'])({ target : { value : v } }) : null}
                      value={memberProp('birthday')}/>
                  </FormGroup>

                  <FormGroup controlId="gender" bsSize="large">
                    <ControlLabel>Gender</ControlLabel>
                    <div>
                      {R.map(g => <Radio onChange={setFieldState(['member', 'gender'])} key={cuid()} name="gender"
                                         inline
                                         value={g}
                                         checked={memberProp('gender') === g}>{g}&nbsp;</Radio>, ['M', 'F', 'X'])}
                    </div>
                  </FormGroup>

                  <FormGroup controlId="referenceId" bsSize="large">
                    <ControlLabel>Tag Number</ControlLabel>
                    <FormControl componentClass="input" disabled={true} placeholder="Tag Number"
                                 value={memberProp('referenceId')}/>
                  </FormGroup>

                  <FormGroup controlId="created" bsSize="large">
                    <ControlLabel>Registration Date</ControlLabel>
                    <FormControl componentClass="input" disabled={true}
                                 value={moment(memberProp('created')).format('YYYY-MM-DD')}/>
                  </FormGroup>

                </Col>
            }
            {
              profileViewIsFocused &&
                <Col md={4} sm={4}>
                  <h2>Contact</h2>

                  <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'email'])}
                                 placeholder="Email" value={memberProp('email')}/>
                  </FormGroup>

                  <FormGroup controlId="phone" bsSize="large">
                    <ControlLabel>Primary Phone</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'phone'])}
                                 placeholder="Primary Phone" value={memberProp('phone')}/>
                  </FormGroup>

                  <FormGroup controlId="alternatePhone" bsSize="large">
                    <ControlLabel>Secondary Phone</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'alternatePhone'])}
                                 placeholder="Secondary Phone" value={memberProp('alternatePhone')}/>
                  </FormGroup>

                  <FormGroup controlId="address" bsSize="large">
                    <ControlLabel>Street Address</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'address1'])}
                                 placeholder="Street Address" value={memberProp('address1')}/>
                    <FormControl style={{ marginTop : '5px' }} componentClass="input"
                                 onChange={setFieldState(['member', 'address2'])} placeholder="Street Address 2"
                                 value={memberProp('address2')}/>
                  </FormGroup>

                  <FormGroup controlId="city" bsSize="large">
                    <ControlLabel>City</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'city'])}
                                 placeholder="City" value={memberProp('city')}/>
                  </FormGroup>

                  <FormGroup controlId="zip" bsSize="large">
                    <ControlLabel>Zip Code</ControlLabel>
                    <FormControl componentClass="input" onChange={setFieldState(['member', 'zip'])}
                                 placeholder="Zip Code" value={memberProp('zip')}/>
                  </FormGroup>

                </Col>
            }
            { activityViewIsFocused && maybeShowMemberActivity(this.props) }
          </Row>
          <Row>
            <Col md={4} sm={4} style={{ textAlign : 'right' }}>
              <Button onClick={e => save(this.props)(this.props.member, this.state.member)}>Save Changes</Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }

  viewPortNeedsResizing() {
    const container     = document.getElementById('TenantMemberProfileCard'),
          viewport      = this.state.tenantMemberProfileCardViewport,
          heightChanged = container.clientHeight !== viewport.height,
          widthChanged  = adjustWidthForViewport(container.clientWidth) !== viewport.width;

    return heightChanged || widthChanged;
  }

  componentDidMount() {
    if (this.viewPortNeedsResizing()){
      onWindowResize(this.props)()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', onWindowResize(this.props));
  }
}

export default connect(
  mapStateToProps
)(TenantMemberProfileCard);
