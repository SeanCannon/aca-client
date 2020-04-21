import React from 'react';
import { Container, Grid, Header, List, Segment } from 'semantic-ui-react';

import Styled from 'styled-components';

const siteName = 'Animal Crossing Art';

const StyledSegment = Styled(Segment)`
  padding          : 1em 0;
  position         : fixed !important;
  z-index          : 9999;
  bottom           : 0;
  width            : 100%;
  font-size        : 0.7em !important;
  background-color : rgba(0, 0, 0, 0.7) !important;
  
  h4 {
    font-size : 0.8em !important;
  }
`;

const Footer = () => (
  <StyledSegment inverted vertical>
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
              <List.Item as="a" href="https://github.com/JonaMX/" target="_blank">Jonatan
              Ju&aacute;rez
              </List.Item>
              <List.Item as="a" href="https://github.com/colebw/" target="_blank">Cole
                Lewis
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={8}>
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
          <Grid.Column width={5}>
            <Header as="h4" inverted>
              Disclaimer
            </Header>
            <List.Item as="p">
              This project is not affiliated in any way with or endorsed by Nintendo Co., Ltd. or Nintendo of America Inc. Animal Crossing™ and Nintendo Switch™ are trademarks of Nintendo.
            </List.Item>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </StyledSegment>
);

export default Footer;
