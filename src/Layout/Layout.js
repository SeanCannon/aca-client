import React from 'react';
import PropTypes from 'prop-types';

import ResponsiveContainer from './ResponsiveConainer';
import Footer from './Footer';
import Share from '../Components/Share/Share';


const Layout = ({ children }) => (
  <ResponsiveContainer>
    {children}
    <Share />
    <Footer />
  </ResponsiveContainer>
);

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
