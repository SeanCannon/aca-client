import * as R                                                            from 'ramda';
import prr                                                               from 'prettycats';
import cuid                                                              from 'cuid';
import React, { Component }                                              from 'react';
import { connect }                                                       from 'react-redux';
import { Col, Row, FormGroup, FormControl, ControlLabel, Button, Radio } from 'react-bootstrap';
import DatePicker                                                        from 'react-bootstrap-date-picker';
import PropTypes                                                         from 'prop-types';
import $                                                                 from 'jquery';

import JpegCameraSwf from 'jpeg-camera-es6/lib/jpeg_camera.swf';
import 'jpeg-camera-es6/lib/swfobject.min.js';
import 'jpeg-camera-es6/lib/canvas-to-blob.min.js';
import JpegCamera from 'jpeg-camera-es6';

import { enrollTenantMember, linkCloudUser } from '../../services/TenantMember';
import { uploadImage }                       from '../../services/Upload';

import './style.css';

const enroll = props => data => Promise.resolve(data)
  .then(enrollTenantMember)
  .then(R.prop('data'))
  .then(R.assoc('tenantMember', R.__, data))
  .then(props.onEnroll);

const link = props => data => Promise.resolve(data)
  .then(R.assoc('cloudUserId', data.id))
  .then(R.pick(['cloudUserId', 'referenceId']))
  .then(linkCloudUser)
  .then(R.prop('data'))
  .then(R.assoc('tenantMember', R.__, data))
  .then(props.onLink);

// TODO Add an onClick handler to the submit button so if any of these still fail it'll select
// TODO the appropriate input and animate it somehow, like a quick grow/shrink bounce or something.
const _validate = predicate => R.ifElse(predicate, R.always('success'), R.always('error'));
const getValidationState = R.prop(R.__, {
  cloudUserId : _validate(prr.isPositiveNumber),
  referenceId : _validate(prr.isStringOfLengthAtMost(60)),
  firstName   : _validate(prr.isStringOfLengthBetweenInclusive(1, 40)),
  lastName    : _validate(prr.isStringOfLengthBetweenInclusive(1, 40)),
  gender      : _validate(prr.stringIsOneOf(['M', 'F', 'X'])),
  email       : _validate(prr.isEmail),
  zip         : _validate(prr.isStringOfLengthBetweenInclusive(5, 10)),
  address1    : _validate(prr.isStringOfLengthBetweenInclusive(1, 50)),
  address2    : _validate(prr.isStringOfLengthBetweenInclusive(1, 40)),
  city        : _validate(prr.isStringOfLengthBetweenInclusive(1, 40)),
  state       : _validate(prr.isStringOfLength(2)),
  birthday    : _validate(prr.isStringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)),
  portrait    : _validate(R.T)
});

const mapStateToProps = (state, ownProps) => ({ ...state.App, ...state.TenantMemberEnrollmentForm });

let camera = null;

const initCamera = () => {
  const theContainer = '#camera';

  JpegCamera(
    theContainer,
    {
      swfUrl        : JpegCameraSwf,
      onInit        : webcam => camera = webcam,
      onReady       : specs => {},
      onError       : console.error,
      onDebug       : console.debug,
      shutter       : false,
      mirror        : false,
      previewMirror : false
    }
  );

  $('.camera-preview').each(function() {
    const $this = $(this);
    $this.css('height', $this.width() / .83);
  });
};

class TenantMemberEnrollmentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      link         : false,
      photoPreview : null
    };
  }

  takePicture() {
    const snapshot = camera.capture();
    const canvas   = snapshot.canvas;
    console.log(snapshot);

    snapshot.getBlob(blob => {
      let fileData = new FormData();
      fileData.append('file', blob, `${cuid()}.jpg`);
      this.props.dispatch(uploadImage(fileData));
    });

    $("#portrait-preview").html(canvas);
  }

  componentWillReceiveProps(nextProps) {
    const { cloudUser, tenantMember } = nextProps;

    if (cloudUser) {
      this.setState({
        tenantMember : cloudUser,
        link         : true
      });
    }

    if (tenantMember.portrait) {
      this.setState(R.assocPath(['tenantMember', 'portrait'], tenantMember.portrait, this.state));
    }

  }

  componentDidMount() {
    initCamera();
  }

  makeTenantMemberShell() {
    return R.compose(
      R.omit(['id']),
      R.merge(this.props.tenantMember),
      R.map(R.always(''))
    )(this.state.tenantMember)
  }

  render() {
    const setFieldState = path => e => this.setState(R.assocPath(path, e.target.value, this.state));

    return (
      <div className="TenantMemberEnrollmentForm">
        { this.state.link ? (
            <Button
              bsSize    = "small"
              className = "btn-primary standard"
              onClick   = { () => {
                this.setState({
                  link         : false,
                  tenantMember : this.makeTenantMemberShell()
                });
                setTimeout(initCamera, 0);
              } }
            >Start Over</Button>
          ) : null }

        <Row>
          <Col md={6} sm={6} xs={12}>

            { JSON.stringify(this.state.tenantMember) }
            <Row>
              <Col md={6} sm={6} xs={12}>
                <FormGroup
                  controlId = "cloudUserId"
                  className = "hidden"
                >
                  <FormControl
                    componentClass = "input"
                    type           = "hidden"
                    value          = { this.state.tenantMember.id }
                  />
                </FormGroup>
                <FormGroup
                  controlId = "country"
                  className = "hidden"
                >
                  <FormControl
                    componentClass = "input"
                    type           = "hidden"
                    value          = { this.state.tenantMember.country }
                  />
                </FormGroup>
                <FormGroup
                  controlId       = "firstName"
                  bsSize          = "large"
                  validationState = {getValidationState('firstName')(this.state.tenantMember.firstName)}
                >
                  <ControlLabel>First Name</ControlLabel>
                  <FormControl
                    componentClass = "input"
                    onChange       = {setFieldState(['tenantMember', 'firstName'])}
                    placeholder    = ""
                    disabled       = { this.state.link }
                    value          = { this.state.tenantMember.firstName }
                  />
                </FormGroup>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <FormGroup
                  controlId       = "lastName"
                  bsSize          = "large"
                  validationState = {getValidationState('lastName')(this.state.tenantMember.lastName)}
                >
                  <ControlLabel>Last Name</ControlLabel>
                  <FormControl
                    componentClass = "input"
                    onChange       = {setFieldState(['tenantMember', 'lastName'])}
                    placeholder    = ""
                    disabled       = { this.state.link }
                    value          = { this.state.tenantMember.lastName }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={6} xs={12}>
                <FormGroup controlId="birthday" bsSize="large">
                  <ControlLabel>DOB</ControlLabel>
                  <DatePicker
                    onChange = {v => v ? setFieldState(['tenantMember', 'birthday'])({ target : { value : v } }) : null}
                    value    = { this.state.tenantMember.birthday }/>
                </FormGroup>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <FormGroup
                  controlId       = "referenceId"
                  bsSize          = "large"
                  validationState = {getValidationState('referenceId')(this.state.tenantMember.referenceId)}
                >
                  <ControlLabel>Reference ID</ControlLabel>
                  <FormControl
                    componentClass = "input"
                    onChange       = {setFieldState(['tenantMember', 'referenceId'])}
                    placeholder    = ""
                    value          = { this.state.tenantMember.referenceId }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6} sm={6} xs={12}>
                <FormGroup
                  controlId       = "email"
                  bsSize          = "large"
                  validationState = {getValidationState('email')(this.state.tenantMember.email)}
                >
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    componentClass = "input"
                    type           = "email"
                    onChange       = {setFieldState(['tenantMember', 'email'])}
                    placeholder    = ""
                    disabled       = { this.state.link }
                    value          = { this.state.tenantMember.email }
                  />
                </FormGroup>
              </Col>
              <Col md={6} sm={6} xs={12}>
                <FormGroup
                  controlId       = "zip"
                  bsSize          = "large"
                  validationState = {getValidationState('zip')(this.state.tenantMember.zip)}
                >
                  <ControlLabel>Zip Code</ControlLabel>
                  <FormControl
                    componentClass = "input"
                    onChange       = {setFieldState(['tenantMember', 'zip'])}
                    placeholder    = ""
                    disabled       = { this.state.link }
                    value          = { this.state.tenantMember.zip }
                  />
                </FormGroup>
              </Col>
            </Row>
            { this.state.link ? null : (
              <Row>
                <Col md={6} sm={6} xs={12}>
                  <FormGroup
                    controlId       = "address1"
                    bsSize          = "large"
                    validationState = {getValidationState('address1')(this.state.tenantMember.address1)}
                  >
                    <ControlLabel>Address 1</ControlLabel>
                    <FormControl
                      componentClass = "input"
                      onChange       = {setFieldState(['tenantMember', 'address1'])}
                      placeholder    = ""
                      value          = { this.state.tenantMember.address1 }
                    />
                  </FormGroup>
                </Col>
                <Col md={6} sm={6} xs={12}>
                  <FormGroup
                    controlId       = "address2"
                    bsSize          = "large"
                    validationState = {getValidationState('address2')(this.state.tenantMember.address2)}
                  >
                    <ControlLabel>Address 2</ControlLabel>
                    <FormControl
                      componentClass = "input"
                      onChange       = {setFieldState(['tenantMember', 'address2'])}
                      placeholder    = ""
                      disabled       = { this.state.link }
                      value          = { this.state.tenantMember.address2 }
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}
            { this.state.link ? null : (
              <Row>
                <Col md={6} sm={6} xs={12}>
                  <FormGroup
                    controlId       = "city"
                    bsSize          = "large"
                    validationState = {getValidationState('city')(this.state.tenantMember.city)}
                  >
                    <ControlLabel>City</ControlLabel>
                    <FormControl
                      componentClass = "input"
                      onChange       = {setFieldState(['tenantMember', 'city'])}
                      placeholder    = ""
                      value          = { this.state.tenantMember.city }
                    />
                  </FormGroup>
                </Col>
                <Col md={2} sm={2} xs={6}>
                  <FormGroup
                    controlId       = "state"
                    bsSize          = "large"
                    validationState = {getValidationState('state')(this.state.tenantMember.state)}
                  >
                    <ControlLabel>State</ControlLabel>
                    <FormControl
                      componentClass = "input"
                      onChange       = {setFieldState(['tenantMember', 'state'])}
                      placeholder    = ""
                      disabled       = { this.state.link }
                      value          = { this.state.tenantMember.state }
                    />
                  </FormGroup>
                </Col>
                <Col md={4} sm={4} xs={6}>
                  <FormGroup
                    controlId       = "gender"
                    bsSize          = "large"
                    validationState = {getValidationState('gender')(this.state.tenantMember.gender)}
                  >
                    <ControlLabel>Gender</ControlLabel>
                    <div>
                      {R.map(g => <Radio onChange={setFieldState(['tenantMember', 'gender'])} key={cuid()} name="gender"
                                         inline
                                         value={g}
                                         checked={this.state.tenantMember.gender === g}>{g}&nbsp;</Radio>, ['M', 'F', 'X'])}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            )}
            </Col>
            { this.state.link ? null : (
              <Col md={6} sm={6} xs={12}>
                <Row>
                  <Col md={6} sm={12} xs={12}>
                    <div id="camera" className="camera-preview"/>
                  </Col>
                  <Col md={6} sm={12} xs={12}>
                    <FormGroup
                      controlId       = "portrait"
                      bsSize          = "large"
                      validationState = {getValidationState('portrait')(this.state.tenantMember.portrait)}
                    >
                      <div id="portrait-preview" className="camera-preview" />
                      <div className="clearfix"></div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} sm={12} xs={12}>
                    <Button
                      bsSize    = "small"
                      className = "pull-right btn-primary standard"
                      onClick   = { (e) => this.takePicture(e) }
                    >Capture Portrait</Button>
                  </Col>
                </Row>
              </Col>
            )}
        </Row>
        <Row>
          <Col md={12} sm={12} xs={12}>
            { this.state.link ? (
                <Button
                  bsSize="large"
                  className="pull-right btn-success submit"
                  onClick={e => link(this.props)(this.state.tenantMember) }
                >Link Cloud User</Button>
              ) : (
                <Button
                  bsSize="large"
                  className="pull-right btn-success submit"
                  onClick={e => enroll(this.props)(this.state.tenantMember) }
                >Enroll New Member</Button>
              )
            }
          </Col>
        </Row>
        <div className="clearfix"/>

      </div>
    );
  }
}

const propTypes = {
  cloudUser : PropTypes.shape({
    email     : PropTypes.string,
    firstName : PropTypes.string,
    lastName  : PropTypes.string,
    portrait  : PropTypes.string
  }),
  tenantMember : PropTypes.shape({
    firstName   : PropTypes.string,
    lastName    : PropTypes.string,
    gender      : PropTypes.string,
    email       : PropTypes.string,
    zip         : PropTypes.string,
    address1    : PropTypes.string,
    address2    : PropTypes.string,
    city        : PropTypes.string,
    state       : PropTypes.string,
    birthday    : PropTypes.string,
    portrait    : PropTypes.string


  }),
  style       : PropTypes.object,
  onEnroll    : PropTypes.func,
  onLink      : PropTypes.func,
  className   : PropTypes.string
};

TenantMemberEnrollmentForm.propTypes = propTypes;

export default connect(
  mapStateToProps
)(TenantMemberEnrollmentForm);
