/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Header,
  Loader,
  Grid,
  Dimmer
} from 'semantic-ui-react';
import ReactCrop from 'react-image-crop';
import Styled from 'styled-components';

import 'react-image-crop/dist/ReactCrop.css';

import DrawingTool from '../../Utils/acnl/libs/DrawingTool';
import generateQR from '../../Utils/acnl/libs/ACNLQRGenerator';
import ImageLoader from './ImageLoader';
import UploadImage from './UploadImage';

import {
  createCropPreview,
  DEFAULT_CROP
} from './utils';

import { Api, ArtSvc } from '../../api';

const HelpText = Styled.div`
  text-align : center;
  font-size  : 0.9em;

  .prompt {
    font-weight   : bold;
    display       : block;
    margin-bottom : 5px;
  }
`;

const ImageModal = ({ onClose, galleryItem = {}, galleryStrategyKey }) => {
  const {
    title = 'Uploaded',
    imageUrl,
    id : galleryItemId
  } = galleryItem;

  const [image, setImage] = useState();
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState({
    ...DEFAULT_CROP
  });

  const [QRImage, setQRImage] = useState(null);
  const [canvas, setCanvas] = useState();
  const [coordinates, setCoordinates] = useState();

  const drawingToolInstance = new DrawingTool();

  useEffect(() => {
    if (!image) {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      fetch(proxyUrl + imageUrl)
        .then(res => res.blob()) // Gets the response and returns it as a blob
        .then(blob => {
          const reader = new FileReader();
          reader.addEventListener('load', () => setImage(reader.result));
          reader.readAsDataURL(blob);
        });
    }
  }, [image, imageUrl]);

  const _onClose = () => {
    ArtSvc.saveRender(Api)({
      galleryStrategyKey,
      galleryItemId,
      image : QRImage
    })
      .then(onClose);
  };

  const onLoad = async img => {
    setOriginalImage(img);
    const newCrop = {
      ...crop,
      aspect : undefined,
      x      : 0,
      y      : 0,
      unit   : 'px',
      width  : img.width / 2,
      height : img.height / 2
    };

    setCrop(newCrop);

    const cropPreview = await createCropPreview(img, newCrop, 'newFile.png');
    setCanvas(cropPreview.canvas);
    setCoordinates(cropPreview.coordinates);
  };

  const makeClientCrop = async newCrop => {
    if (originalImage && newCrop.width && newCrop.height) {
      const cropPreview = await createCropPreview(originalImage, newCrop, 'newFile.png');
      setCanvas(cropPreview.canvas);
      setCoordinates(cropPreview.coordinates);
    }
  };

  const setCroppedRender = data => {
    generateQR(data, title).then(setQRImage);
  };

  const handleFileUploaded = uploadedImage => setImage(uploadedImage);

  return (
    <Modal
      centered={false}
      open
      onClose={_onClose}
      size="small"
      closeIcon
    >
      <Modal.Header>Upload Photo</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>{title}</Header>
          { !imageUrl ? (
            <UploadImage onSetImage={handleFileUploaded} />
          ) : !image
            ? (
              <Dimmer active>
                <Loader />
              </Dimmer>
            )
            : null
          }

          <div>

            { canvas && coordinates && drawingToolInstance ? (
                <ImageLoader
                  canvas={canvas}
                  coordinates={coordinates}
                  drawingToolInstance={drawingToolInstance}
                  setCroppedRender={setCroppedRender}
                  title={title}
                />
            ) : null
            }

            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <ReactCrop
                  src={image}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={newCrop => setCrop(newCrop)}
                  onComplete={makeClientCrop}
                  keepSelection
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                { QRImage ? (
                  <>
                    <img
                      src={QRImage}
                      style={{
                        display         : 'block',
                        margin          : '0 auto 20px auto',
                        backgroundColor : 'rgba(0, 0, 0, 0.2)',
                        borderRadius    : '10px',
                        width           : '90%'
                      }}
                      alt=""
                    />
                    <HelpText>
                      <span className="prompt">Forget the next step?</span>
                      <span>
                        No worries! Just <a href="https://www.youtube.com/embed/3j0BR_Y-kkI?autoplay=1&origin=https://www.animalcrossingart.com" target="_blank" rel="noopener noreferrer">Watch the tutorial</a>&nbsp;
                        or <a href="https://discord.gg/mBMsHvN" target="_blank" rel="noopener noreferrer">ask for help</a> :)
                      </span>
                    </HelpText>
                    <div className="addthis_tipjar_inline" />
                  </>
                ) : <div />
                }
              </Grid.Column>
            </Grid>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

ImageModal.propTypes = {
  onClose            : PropTypes.func,
  galleryStrategyKey : PropTypes.string,
  galleryItem        : {
    id       : PropTypes.number,
    title    : PropTypes.string,
    imageUrl : PropTypes.string
  }
};

export default ImageModal;
