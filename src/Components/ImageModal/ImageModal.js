import React, { useState, useEffect } from 'react';
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
import { Api, ArtSvc } from '../../api';

const MAX_WIDTH_HEIGHT = 100;

const QrNestedModal = ({ onClose, loaded, croppedFile }) => {
  const [open, setOpen] = useState(false);
  const [scaledImage, setScaledImage] = useState(null)

  const upload = file => {
    return ArtSvc.convert(Api)({ file })
      .catch(console.error)
  };

  const handleOpen = () => {
    upload(croppedFile)
      .then(({ data }) => new Blob([data], { type: 'image/png' }))
      .then(blob => {
        blob.name = 'scaled.png';
        window.URL.revokeObjectURL(setScaledImage);
        setScaledImage(window.URL.createObjectURL(blob));
      })
      .then(() => setOpen(true));
  };

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
          <img src={scaledImage} crossOrigin="anonymous" alt="" />
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
    height: 50,
    width: 50
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

  const getImageDimensionsBasedOnMax = (width, height, maxWidthHeight) => {
    const ratio = Math.min(maxWidthHeight / width, maxWidthHeight / height);

    return { width: width * ratio, height: height * ratio };
  };

  const createCropPreview = async (img, newCrop, fileName) => {
    const canvas = document.createElement('canvas');
    const smallDimensions = getImageDimensionsBasedOnMax(newCrop.width, newCrop.height, MAX_WIDTH_HEIGHT);
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = smallDimensions.width;
    canvas.height = smallDimensions.height;
    const ctx = canvas.getContext('2d');
    // debugger;
    ctx.drawImage(
      img,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      smallDimensions.width,
      smallDimensions.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        // eslint-disable-next-line no-param-reassign
        blob.name = fileName;
        setCroppedFile(blob);
      }, 'image/jpeg');
      // eslint-disable-next-line no-console
    }).catch(error => console.log('Blob error: ', error));
  };

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
    await createCropPreview(img, newCrop, 'newFile.jpg');
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
              keepSelection
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
