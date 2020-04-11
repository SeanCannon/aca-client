import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Header,
  Icon,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react';
import Gallery from '../Components/Gallery/Gallery';
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
          style={{ minHeight: 700, padding: '1em 0em' }}
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
              <Menu.Item as="a" active>
                {siteName}
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
          style={{ minHeight: 350, padding: '1em 0em' }}
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

const Layout = () => (
  <ResponsiveContainer>
    <Gallery />

    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as="h4" content="Developers" />
              <List link inverted>
                <List.Item as="a" href="https://github.com/seancannon/" target="_blank">Sean Cannon</List.Item>
                <List.Item as="a" href="https://github.com/divijb" target="_blank">Divij Baboo</List.Item>
                {/* <List.Item as='a' href="https://github.com/SeanCannon/" target="_blank">Jonatan Ju&aacute;rez</List.Item> */}
                <List.Item as="a" href="https://github.com/colebw/" target="_blank">Cole Lewis</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header as="h4" inverted>
                {siteName}
              </Header>
              <List link inverted>
                <List.Item as="a" href="https://animal-crossing.com/" target="_blank">Animal Crossing</List.Item>
                <List.Item as="a" href="https://www.metmuseum.org/" target="_blank">The Metropolitan Museum of Art</List.Item>
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
);

export default Layout;
