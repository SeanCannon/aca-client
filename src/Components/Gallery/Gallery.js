import React from 'react';
import {
  Container,
  Header,
  Segment,
  Pagination
} from 'semantic-ui-react';

const Gallery = () => {
  return (
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as="h3" style={{ fontSize: '2em' }}>
          Gallery
        </Header>
        <Pagination
          defaultActivePage={1}
          firstItem={null}
          lastItem={null}
          pointing
          secondary
          totalPages={3}
        />
      </Container>
    </Segment>
  );
};

export default Gallery;
