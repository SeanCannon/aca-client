import React from 'react';
import PropTypes from 'prop-types';

import ResponsiveContainer from './ResponsiveConainer';
import Footer from './Footer';


const Layout = ({ children }) => (
  <ResponsiveContainer>
    {children}
    <Footer />
  </ResponsiveContainer>
);

Layout.propTypes = {
  children: PropTypes.node
};

export default Layout;
