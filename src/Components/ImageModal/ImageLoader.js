import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { imageQuantize } from './utils';
import DrawingTool from '../../Utils/acnl/libs/DrawingTool';

const PATTERN_TYPE_EASEL = 9;

/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
const ImageLoader = ({
  canvas,
  coordinates,
  drawingToolInstance,
  setCroppedRender,
  title = ''
}) => {
  const [patternType] = useState(PATTERN_TYPE_EASEL);
  const [convertTrans] = useState(50);

  const muralWide = 1;
  const muralTall = 1;

  const previewRef = useRef();
  const postViewRef = useRef();
  const postMixRef = useRef();

  useEffect(() => {
    if (previewRef.current && postViewRef.current && postMixRef.current) {
      drawingToolInstance.addCanvas(postViewRef.current);

      const iSize = drawingToolInstance.width;
      let oSize = drawingToolInstance.width;

      const patternAspectRatio = muralWide / muralTall;

      if (patternAspectRatio < 1) {
        while (oSize * muralTall < 256) {
          oSize += 32;
        }
      } else {
        while (oSize * muralWide < 256) {
          oSize += 32;
        }
      }

      previewRef.current.width = iSize * muralWide;
      previewRef.current.height = iSize * muralTall;
      postMixRef.current.width = oSize * muralWide;
      postMixRef.current.height = oSize * muralTall;

      const pmCtx = postMixRef.current.getContext('2d');

      pmCtx.imageSmoothingEnabled = false;

      const ctx = previewRef.current.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(canvas, 0, 0, iSize * muralWide, iSize * muralTall);

      for (let x = 0; x < muralWide; x++) {
        for (let y = 0; y < muralTall; y++) {
          const imageData = ctx.getImageData(iSize * x, iSize * y, iSize, iSize);

          imageQuantize({ imageData, drawingToolInstance, convertTrans });

          const pixelCount = drawingToolInstance.pixelCount * 4;

          for (let i = 0; i < pixelCount; i += 4) {
            const _x = (i >> 2) % iSize;
            const _y = Math.floor((i >> 2) / iSize);
            if (imageData.data[i + 3] < convertTrans * 2.55) {
              drawingToolInstance.setPixel(_x, _y, 15);
            } else {
              drawingToolInstance.setPixel(_x, _y, [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
            }
          }

          drawingToolInstance.title = title; // title.substring(0, 16);

          drawingToolInstance.onLoad();

          pmCtx.drawImage(postViewRef.current, 0, 0, 64, 64, oSize * x, oSize * y, oSize, oSize);

          // This may override an attempted multi-qr render.
          // TODO revisit this when we support murals
          setCroppedRender(drawingToolInstance.toString());
        }
      }
    }
  }, [coordinates, canvas, convertTrans, drawingToolInstance, setCroppedRender, title]);

  if (!(canvas instanceof HTMLCanvasElement)) {
    return null;
  }

  if (!previewRef || !postViewRef || !postMixRef) {
    return null;
  }


  drawingToolInstance.patternType = patternType;
  // drawingToolInstance.authorStrict = ' TODO see if we can override here';

  return (
    <>
      <canvas style={{ display : 'none' }} ref={previewRef} />
      <canvas style={{ display : 'none' }} ref={postViewRef} width="64" height="64" />
      <canvas style={{ display : 'none' }} ref={postMixRef} width="256" height="256" />
    </>
  );
};

ImageLoader.propTypes = {
  canvas              : PropTypes.node,
  coordinates         : PropTypes.shape({}),
  drawingToolInstance : PropTypes.instanceOf(DrawingTool),
  setCroppedRender    : PropTypes.func,
  title               : PropTypes.string
};

export default ImageLoader;
