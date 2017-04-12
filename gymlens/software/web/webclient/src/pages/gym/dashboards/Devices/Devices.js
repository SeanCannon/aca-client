import React, { Component } from 'react';
import './DeviceManagement.css';
import { Grid, Row, Col } from 'react-bootstrap';
import SideNav from '../../../../components/SideNav/SideNav';

class DeviceManagement extends Component {
  render() {
    return (
      <div className="DeviceManagement">
        <Grid>
          <Row>
            <Col md={3}>
              <SideNav/>
            </Col>
            <Col md={9}>
              device management stuff...
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default DeviceManagement;
