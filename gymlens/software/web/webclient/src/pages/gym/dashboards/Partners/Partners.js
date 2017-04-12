import React, { Component } from 'react';
import './Devices.css';
import { Grid, Row, Col } from 'react-bootstrap';
import SideNav from '../../../../components/SideNav/SideNav';

class Devices extends Component {
  render() {
    return (
      <div className="Devices">
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

export default Devices;
