import React from 'react';
import {
  Button,
  Container,
  Header,
  Segment
} from 'semantic-ui-react'

const Gallery = () => {
  return (
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Gallery
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Choose from
        </p>
        <Button as='a' size='large'>
          Read More
        </Button>
      </Container>
    </Segment>
  );
}

export default Gallery;
