import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Header,
  Loader,
  Dimmer, Button
} from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import QrNestedModal from './QRNestedModal';
import ImageLoader from './ImageLoader';

import { createCropPreview, DEFAULT_CROP } from './utils';

const ImageModal = ({ onClose, galleryItem, galleryStrategyKey }) => {
  const {
    title,
    imageUrl,
    id : galleryItemId
  } = galleryItem;

  const [image, setImage] = useState();
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [crop, setCrop] = useState({
    ...DEFAULT_CROP
  });

  useEffect(() => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyUrl + imageUrl)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        const reader = new FileReader();
        reader.addEventListener('load', () => setImage(reader.result));
        reader.readAsDataURL(blob);
      });
  }, [imageUrl]);


  const onLoad = async img => {
    setOriginalImage(img);
    const newCrop = {
      ...crop,
      aspect: undefined,
      x: 0,
      y: 0,
      unit: 'px',
      width: img.width / 2,
      height: img.height / 2
    };

    setCrop(newCrop);

    const imageBlob = await createCropPreview(img, newCrop, 'newFile.png');
    setCroppedFile(imageBlob);
  };

  const makeClientCrop = async newCrop => {
    if (originalImage && newCrop.width && newCrop.height) {
      const imageBlob = await createCropPreview(originalImage, newCrop, 'newFile.png');
      setCroppedFile(imageBlob);
    }
  };

  const renderTrigger = loaded => (
    <Button
      primary
      icon
      disabled={!loaded}
    >
      Get QR Code
    </Button>
  );

  return (
    <Modal
      centered={false}
      open
      onClose={onClose}
      size="small"
      closeIcon
    >
      <Modal.Header>Upload Photo</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>{title}</Header>
          {
            !image
              ? (
                <Dimmer active>
                  <Loader />
                </Dimmer>
              )
              : null
          }
          <div>

            { console.log('fuck')}
            <ImageLoader/>
            {/*<ReactCrop*/}
              {/*src={image}*/}
              {/*onImageLoaded={onLoad}*/}
              {/*crop={crop}*/}
              {/*onChange={newCrop => setCrop(newCrop)}*/}
              {/*onComplete={makeClientCrop}*/}
              {/*keepSelection*/}
            {/*/>*/}
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <QrNestedModal
          onClose={onClose}
          loaded={!!originalImage}
          croppedFile={croppedFile}
          trigger={renderTrigger}
          galleryItemId={galleryItemId}
          galleryStrategyKey={galleryStrategyKey}
        />
      </Modal.Actions>
    </Modal>
  );
};

ImageModal.propTypes = {
  onClose: PropTypes.func,
  galleryItem: {
    id: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string
  }
};

export default ImageModal;
