import React, { useState, useRef } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Api, ArtSvc } from '../../api';
// import { generateQR } from '../../Utils/QRGenerator';
import generateQR from '../../Utils/acnl/libs/ACNLQRGenerator';
import DrawingTool from '../../Utils/acnl/libs/DrawingTool';


const Image = styled.img`
  width: 150px;
  height : 150px;
  image-rendering: pixelated;
`;

const QrNestedModal = ({
  onClose,
  loaded,
  croppedFile,
  trigger,
  galleryItemId,
  galleryStrategyKey
}) => {
  const [open, setOpen] = useState(false);
  const [scaledImage, setScaledImage] = useState(null);
  const [QRImage, setQRImage] = useState(null);

  const upload = file => {
    return ArtSvc.convert(Api)({ file, galleryItemId, galleryStrategyKey })
    // eslint-disable-next-line no-console
      .catch(console.error);
  };

  const handleOpen = () => {
    const foo = new DrawingTool(croppedFile);
    console.log({ foo : foo.toString()})
    upload(croppedFile)
      .then(({ data }) => {
        console.log({ data })
        debugger;
        const arrayBuffer = new Uint8Array(data).buffer;
        generateQR(arrayBuffer).then(setQRImage);
        return new Blob([arrayBuffer], { type: 'image/png' });
      })
      .then(blob => {
      // eslint-disable-next-line no-param-reassign
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
      trigger={trigger(loaded)}
    >
      <Modal.Header>QR Code</Modal.Header>
      <Modal.Content>
        <div>
          <img
            src={QRImage}
            alt=""
          />
        </div>
        <div>
          <Image
            src={scaledImage}
            alt=""
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button content="All Done" onClick={handleClose} />
      </Modal.Actions>
    </Modal>
  );
};

QrNestedModal.propTypes = {
  trigger: PropTypes.node,
  onClose: PropTypes.func,
  loaded: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  croppedFile: PropTypes.any
};

export default QrNestedModal;
