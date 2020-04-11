import React              from 'react';
import { Link }           from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap'

import './style.css';

const FooterNav = props =>
  <div className="FooterNav">
    <Grid>
      <Row>
        <div className="row-height">
          <Col xs={12} sm={6} md={3} className="col-height">
            <h3 className="FooterNav-column-title">About Us</h3>
            <Link to="/company">Who we are</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/advertise">Advertise</Link>
          </Col>
          <Col xs={12} sm={6} md={3} className="col-height">
            <h3 className="FooterNav-column-title">Using Winston</h3>
            <Link to="/how-does-winstonretail-work">How it works</Link>
            <Link to="/support">Support</Link>
            <Link to="/terms-of-use">Terms</Link>
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/copyright-and-trademark">Copyright</Link>
          </Col>
          <Col xs={12} sm={6} md={3} className="col-height">
            <h3 className="FooterNav-column-title">Discover</h3>
            Lorem Ipsum
          </Col>
          <Col xs={12} sm={6} md={3} className="col-height">
            <h3 className="FooterNav-column-title">Hello</h3>
            <a target="_blank" href="http://blog.winstonretail.com">Our Blog</a>
            <a target="_blank" href="https://www.facebook.com/winstonretail">Facebook</a>
            <a target="_blank" href="https://twitter.com/winstonretail">Twitter</a>
            <a target="_blank" href="https://www.instagram.com/winstonretail/">Instagram</a>
            <Link to="/contact-us">Contact Us</Link>
          </Col>
        </div>
      </Row>
    </Grid>
  </div>;

export default FooterNav;
