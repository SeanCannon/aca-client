import React, { Component } from 'react';
import './Device.css';
import { Grid, Row, Col } from 'react-bootstrap';
import SideNav from '../../../../components/SideNav/SideNav';

class Device extends Component {
  render() {
    return (
      <div className="Device">
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

export default Device;
