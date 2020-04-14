import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  Header,
  Loader,
  Dimmer
} from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const QrNestedModal = ({ onClose, loaded, croppedFile }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      size="small"
      trigger={
        <Button
          primary
          icon
          disabled={!loaded}
        >
          Get QR Code
        </Button>
      }
    >
      <Modal.Header>QR Code</Modal.Header>
      <Modal.Content>
        <p>[QR Code here]</p>
        <div>
          <img src={croppedFile} crossOrigin="anonymous" alt="asf" />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button content="All Done" onClick={handleClose} />
      </Modal.Actions>
    </Modal>
  );
};

QrNestedModal.propTypes = {
  onClose: PropTypes.func,
  loaded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  croppedFile: PropTypes.any
};

const ImageModal = ({ onClose, galleryItem }) => {
  const {
    title,
    imageUrl
  } = galleryItem;

  const [image, setImage] = useState();
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    aspect: 1 / 1
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

  const onLoad = useCallback(img => {
    setOriginalImage(img);
  }, []);

  const createCropPreview = async (img, newCrop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = newCrop.width;
    canvas.height = newCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      newCrop.width,
      newCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        // eslint-disable-next-line no-param-reassign
        blob.name = fileName;
        window.URL.revokeObjectURL(setCroppedFile);
        setCroppedFile(window.URL.createObjectURL(blob));
      }, 'image/jpeg');
      // eslint-disable-next-line no-console
    }).catch(error => console.log('Blob error: ', error));
  };

  const makeClientCrop = async newCrop => {
    if (originalImage && newCrop.width && newCrop.height) {
      await createCropPreview(originalImage, newCrop, 'newFile.jpg');
    }
  };

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

            <ReactCrop
              src={image}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={newCrop => setCrop(newCrop)}
              onComplete={makeClientCrop}
            />
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <QrNestedModal
          onClose={onClose}
          loaded={!!originalImage}
          croppedFile={croppedFile}
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
