import PropTypes from 'prop-types';
import React from 'react';
import {
  Container,
  Header,
  Button
} from 'semantic-ui-react';
import { Link } from 'react-scroll';

import heroImage from './hero.jpg';

const GalleryLink = () => (
  <Link
    to="gallery"
    spy
    smooth
    duration={500}
    style={{ color : '#304241' }}
  >
    { window.localStorage.getItem('dev') ? 'Browse The Gallery' : 'Coming Soon!'}
  </Link>
);

const Hero = ({ mobile }) => {
  return (
    <Container style={{
      minHeight          : 700,
      width              : '100%',
      backgroundImage    : `url(${heroImage})`,
      backgroundSize     : 'cover',
      backgroundRepeat   : 'no-repeat',
      backgroundPosition : 'center center'
    }}>
      <Header
        as="h1"
        content="Animal Crossing Art"
        inverted
        style={{
          fontSize   : mobile ? '3em' : '6em',
          fontWeight : 'normal',
          margin     : 0,
          paddingTop : mobile ? '1.5em' : '1em',
          fontFamily : 'Jua',
          textShadow : '2px 2px 0 rgba(0, 0, 0, 0.5)'
        }}
      />
      <Header
        as="h2"
        content="Upgrade Your Island With Some Fine Culture"
        inverted
        style={{
          fontSize   : mobile ? '1.5em' : '1.7em',
          fontWeight : 'normal',
          marginTop  : 0,
          fontFamily : 'Jua',
          textShadow : '2px 2px 0 rgba(0, 0, 0, 0.5)'
        }}
      />
      <Button
        style={{
          fontSize        : mobile ? '1.5em' : '1.7em',
          fontWeight      : 'normal',
          fontFamily      : 'Jua',
          backgroundColor : 'rgba(247,218,177, 0.8)',
          border          : '1px solid #304241'
        }}
        content={<GalleryLink />}
      />
    </Container>
  );
};

Hero.propTypes = {
  mobile: PropTypes.bool
};

export default Hero;
