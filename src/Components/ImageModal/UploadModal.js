import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Button
} from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import QrNestedModal from './QRNestedModal';
import { createCropPreview } from './utils';
import UploadImage from './UploadImage';


const UploadModal = ({ onClose }) => {
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    height: 50,
    width: 50
  });

  const renderTrigger = loaded => (
    <Button
      primary
      icon
      disabled={!loaded}
    >
      Get QR Code
    </Button>
  );


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

    const imageBlob = await createCropPreview(img, newCrop, 'newFile.jpg');
    setCroppedFile(imageBlob);
  };

  const makeClientCrop = async newCrop => {
    if (originalImage && newCrop.width && newCrop.height) {
      const imageBlob = await createCropPreview(originalImage, newCrop, 'newFile.jpg');
      setCroppedFile(imageBlob);
    }
  };

  const handleFileUploaded = uploadedImage => setImage(uploadedImage);

  return (
    <Modal
      centered={false}
      open
      onClose={onClose}
      size="small"
      closeIcon
    >
      <Modal.Header>Upload Image</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <UploadImage onSetImage={handleFileUploaded} />
              <ReactCrop
                src={image}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={newCrop => setCrop(newCrop)}
                onComplete={makeClientCrop}
                keepSelection
              />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <QrNestedModal
          onClose={onClose}
          loaded={!!originalImage}
          croppedFile={croppedFile}
          trigger={renderTrigger}
        />
      </Modal.Actions>
    </Modal>
  );
};

UploadModal.propTypes = {
  onClose: PropTypes.func
};

export default UploadModal;
