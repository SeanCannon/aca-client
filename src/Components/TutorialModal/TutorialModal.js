import React from 'react';
import { Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const TutorialModal = ({ onClose }) => (
  <Modal
    centered={false}
    open
    onClose={onClose}
    size="small"
    closeIcon
  >
    <Modal.Header>Tutorial</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <p>If this video doesn&#039;t help you, please visit our <a href="https://discord.gg/mBMsHvN" target="_blank" rel="noopener noreferrer">Discord server</a>.</p>

        <iframe
          title="AnimalCrossingArt.com Tutorial"
          id="ytplayer"
          type="text/html"
          width="640"
          height="360"
          src="https://www.youtube.com/embed/0lassKm9IQo?autoplay=1&origin=https://www.animalcrossingart.com"
          frameBorder="0"
        />
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

TutorialModal.propTypes = {
  onClose : PropTypes.func
};

export default TutorialModal;
