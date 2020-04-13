import React from 'react';
import { Container, Grid, Header, List, Segment } from 'semantic-ui-react';

const siteName = 'Animal Crossing Art';

const Footer = () => (
  <Segment inverted vertical style={{ padding: '5em 0em' }}>
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column width={3}>
            <Header inverted as="h4" content="Developers" />
            <List link inverted>
              <List.Item
                as="a"
                href="https://github.com/seancannon/"
                target="_blank">Sean Cannon
              </List.Item>
              <List.Item as="a" href="https://github.com/divijb" target="_blank">Divij
                Baboo
              </List.Item>
              {/* <List.Item as='a' href="https://github.com/SeanCannon/" target="_blank">Jonatan Ju&aacute;rez</List.Item> */}
              <List.Item as="a" href="https://github.com/colebw/" target="_blank">Cole
                Lewis
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as="h4" inverted>
              {siteName}
            </Header>
            <List link inverted>
              <List.Item
                as="a"
                href="https://animal-crossing.com/"
                target="_blank">Animal Crossing
              </List.Item>
              <List.Item as="a" href="https://www.metmuseum.org/" target="_blank">The
                Metropolitan Museum of Art
              </List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
);

export default Footer;
