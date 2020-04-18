import {
  Container, Icon,
  Menu,
  Responsive,
  Segment, Sidebar,
  Visibility
} from 'semantic-ui-react';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Hero from '../Components/Hero/Hero';

const siteName = 'Animal Crossing Art';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const DesktopContainer = ({ children }) => {
  const [fixed, setFixed] = useState(false);

  const hideFixedMenu = () => setFixed(false);
  const showFixedMenu = () => setFixed(true);

  return (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={showFixedMenu}
        onBottomPassedReverse={hideFixedMenu}
      >
        <Segment
          inverted
          textAlign="center"
          style={{
            minHeight : 700,
            padding   : '1em 0em'
          }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : null}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            size="large"
          >
            <Container>
              <Menu.Item as="a" href="/">
                Home
              </Menu.Item>
              <Menu.Item as="a" target="_blank" href="https://discord.gg/mBMsHvN">
                Discord
              </Menu.Item>
              <Menu.Item as="a" target="_blank" href="https://www.facebook.com/AnimalCrossingArt-110478317288315">
                Facebook
              </Menu.Item>
              <Menu.Item as="a" target="_blank" href="https://twitter.com/crossingart">
                Twitter
              </Menu.Item>
              <Menu.Item as="a" target="_blank" href="https://www.instagram.com/animalcrossingartdotcom">
                Instagram
              </Menu.Item>
            </Container>
          </Menu>
          <Hero />
        </Segment>
      </Visibility>

      {children}
    </Responsive>
  );
};

DesktopContainer.propTypes = {
  children: PropTypes.node
};

const MobileContainer = ({ children }) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const hideSidebar = () => setSidebarOpened(false);
  const showSidebar = () => setSidebarOpened(true);

  return (
    <Responsive
      as={Sidebar.Pushable}
      getWidth={getWidth}
      maxWidth={Responsive.onlyMobile.maxWidth}
    >
      <Sidebar
        as={Menu}
        animation="push"
        inverted
        onHide={hideSidebar}
        vertical
        visible={sidebarOpened}
      >
        <Menu.Item as="a" active>
          {siteName}
        </Menu.Item>
      </Sidebar>

      <Sidebar.Pusher dimmed={sidebarOpened}>
        <Segment
          inverted
          textAlign="center"
          style={{
            minHeight : 350,
            padding   : '1em 0em'
          }}
          vertical
        >
          <Container>
            <Menu inverted pointing secondary size="large">
              <Menu.Item onClick={showSidebar}>
                <Icon name="sidebar" />
              </Menu.Item>
            </Menu>
          </Container>
          <Hero mobile />
        </Segment>

        {children}
      </Sidebar.Pusher>
    </Responsive>
  );
};

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

export default ResponsiveContainer;
