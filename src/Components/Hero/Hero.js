import PropTypes from 'prop-types';
import React from 'react';
import {
  Container,
  Header
} from 'semantic-ui-react';

const Hero = ({ mobile }) => {
  return (
    <Container text>
    <Header
      as="h1"
      content="Super Cool CTA"
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em'
      }}
    />
    <Header
      as="h2"
      content="Do whatever you want when you want to."
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em'
      }}
    />
    </Container>
  );
};

Hero.propTypes = {
  mobile: PropTypes.bool
};

export default Hero;
