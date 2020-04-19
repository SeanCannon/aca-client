import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DrawingTool from '../../Utils/acnl/libs/DrawingTool';

const PATTERN_TYPE_EASEL = 9;

const ImageLoader = () => {

  const [dataUrl, setDataUrl]               = useState('');
  const [patternType, setPatternType]       = useState(PATTERN_TYPE_EASEL);
  const [convertMethod, setConvertMethod]   = useState('quantize');
  const [convertQuality, setConvertQuality] = useState('high');
  const [convertTrans, setConvertTrans]     = useState(50);
  const [isCropping, setIsCropping]         = useState(false);
  const [fileLoaded, setFileLoaded]         = useState(false);
  const [fileName, setFileName]             = useState('');
  const [outputs, setOutputs]               = useState([]);

  const draw = new DrawingTool();
  const muralWide = 1;
  const muralTall = 1;

  const previewRef  = useRef();
  const postViewRef = useRef();
  const postMixRef  = useRef();
  const filesRef    = useRef();

  const getDefaultPosition = () =>({top:0, left:0});

  const getDefaultSize = ({ imageHeight, imageWidth }) => ({
    height: imageHeight,
    width: imageWidth
  });

  const onCrop = ({coordinates, canvas}) => {
    if (!(canvas instanceof HTMLCanvasElement)){return;}
    setOutputs([]);

    const iSize = draw.width;
    let oSize   = draw.width;

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

    previewRef.current.width  = iSize * muralWide;
    previewRef.current.height = iSize * muralTall;
    postMixRef.current.width  = oSize * muralWide;
    postMixRef.current.height = oSize * muralTall;

    const pmCtx = postMixRef.current.getContext('2d');

    pmCtx.imageSmoothingEnabled = false;

    const ctx = previewRef.current.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = convertQuality;

    console.log('drawing!', canvas, 0, 0, iSize * muralWide, iSize * muralTall)
    ctx.drawImage(canvas, 0, 0, iSize * muralWide, iSize * muralTall);


    for(let x = 0; x < muralWide; x++) {
      for(let y = 0; y < muralTall; y++) {
        const imageData = ctx.getImageData(iSize * x, iSize * y, iSize, iSize);

        imageQuantize(imageData);

        const pixelCount = draw.pixelCount * 4;

        for (let i = 0; i < pixelCount; i += 4) {
          let x = (i >> 2) % iSize;
          let y = Math.floor((i >> 2) / iSize);
          if (imageData.data[i + 3] < convertTrans * 2.55) {
            draw.setPixel(x, y, 15);
          } else {
            draw.setPixel(x, y, [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
          }
        }

        draw.title = fileName.substring(0, 16);

        console.log('loading...');
        draw.onLoad();

        setOutputs([...outputs, draw.toString()]);

        pmCtx.drawImage(postViewRef.current, 0, 0, 64, 64, oSize * x, oSize * y, oSize, oSize);

      }
    }
  };

  // image_rgb(imageData){
  //   let palette = [];
  //   for (let i = 0; i < 256; i++){palette.push({n: i, c:0});}
  //   const pixelCount = imageData.data.length;
  //   for (let i = 0; i < pixelCount; i+=4){
  //     if (imageData.data[i+3] < this.convert_trans*2.55){continue;}
  //     palette[this.draw.findRGB([imageData.data[i], imageData.data[i+1], imageData.data[i+2]])].c++;
  //   }
  //   palette.sort((a, b) => {
  //     if (a.c > b.c){return -1;}
  //     if (a.c < b.c){return 1;}
  //     return 0;
  //   });
  //   for (let i = 0; i < 15; i++){this.draw.setPalette(i, palette[i].n);}
  // },

  // image_yuv(imageData){
  //   let palette = [];
  //   for (let i = 0; i < 256; i++){palette.push({n: i, c:0});}
  //   const pixelCount = imageData.data.length;
  //   for (let i = 0; i < pixelCount; i+=4){
  //     if (imageData.data[i+3] < this.convert_trans*2.55){continue;}
  //     palette[this.draw.findYUV([imageData.data[i], imageData.data[i+1], imageData.data[i+2]])].c++;
  //   }
  //   palette.sort(function(a, b){
  //     if (a.c > b.c){return -1;}
  //     if (a.c < b.c){return 1;}
  //     return 0;
  //   });
  //   for (let i = 0; i < 15; i++){this.draw.setPalette(i, palette[i].n);}
  // },


  const imageQuantize = (imageData) => {
    const pixelCount = imageData.data.length;
    let pixels       = [];
    for (let i = 0; i < pixelCount; i += 4) {
      if (imageData.data[i + 3] < convertTrans * 2.55) {
        continue;
      }
      pixels.push({ r : imageData.data[i], g : imageData.data[i + 1], b : imageData.data[i + 2] });
    }

    const medianCut = pixels => {
      let l     = Math.floor(pixels.length / 2);
      let r_min = null;
      let r_max = null;
      let g_min = null;
      let g_max = null;
      let b_min = null;
      let b_max = null;
      for (let i in pixels) {
        if (pixels[i].r < r_min || r_min === null) {
          r_min = pixels[i].r;
        }
        if (pixels[i].r > r_max || r_max === null) {
          r_max = pixels[i].r;
        }
        if (pixels[i].g < g_min || g_min === null) {
          g_min = pixels[i].g;
        }
        if (pixels[i].g > g_max || g_max === null) {
          g_max = pixels[i].g;
        }
        if (pixels[i].b < b_min || b_min === null) {
          b_min = pixels[i].b;
        }
        if (pixels[i].b > b_max || b_max === null) {
          b_max = pixels[i].b;
        }
      }
      let r_dist = r_max - r_min;
      let g_dist = g_max - g_min;
      let b_dist = b_max - b_min;
      if (r_dist >= g_dist && r_dist >= b_dist) {

        pixels.sort((a, b) => (a.r - b.r));
      } else if (g_dist >= r_dist && g_dist >= b_dist) {

        pixels.sort((a, b) => (a.g - b.g));
      } else {

        pixels.sort((a, b) => (a.b - b.b));
      }
      return [pixels.slice(0, l), pixels.slice(l)];
    };
    const medianMultiCut = (buckets) => {
      let res = [];
      for (let i in buckets) {
        const newBuck = medianCut(buckets[i]);
        if (newBuck[0].length) {
          res.push(newBuck[0]);
        }
        if (newBuck[1].length) {
          res.push(newBuck[1]);
        }
      }
      return res;
    };

    let buckets = medianCut(pixels);
    buckets     = medianMultiCut(buckets);
    buckets     = medianMultiCut(buckets);
    buckets     = medianMultiCut(buckets);

    let colors  = [];
    let uniqCol = new Set();

    const pushAvg = (b) => {
      let r_avg = 0;
      let g_avg = 0;
      let b_avg = 0;
      for (let i in b) {
        r_avg += b[i].r;
        g_avg += b[i].g;
        b_avg += b[i].b;
      }
      let rgb = [Math.round(r_avg / b.length), Math.round(g_avg / b.length), Math.round(b_avg / b.length)];
      let idx = draw.findRGB(rgb);
      if (!uniqCol.has(idx)) {
        colors.push(idx);
        uniqCol.add(idx);
      }
    };

    for (let i in buckets) {
      pushAvg(buckets[i]);
    }
    console.log("Unique colors: " + uniqCol.size);

    if (uniqCol.size < 15) {

      buckets = medianMultiCut(buckets);
      for (let i in buckets) {
        pushAvg(buckets[i]);
      }
      console.log("Unique colors after further quantize: " + uniqCol.size);
      if (uniqCol.size < 15) {
        buckets = medianMultiCut(buckets);
        for (let i in buckets) {
          pushAvg(buckets[i]);
        }
        console.log("Unique colors after further quantize: " + uniqCol.size);
        if (uniqCol.size < 15) {
          buckets = medianMultiCut(buckets);
          for (let i in buckets) {
            pushAvg(buckets[i]);
          }
          console.log("Unique colors after further quantize: " + uniqCol.size);
        }
      }
    } else if (uniqCol.size > 15) {

      let minDist = 255 * 255 * 3;
      let bucketA = null;
      let bucketB = null;
      for (let i in colors) {
        for (let j in colors) {
          if (i >= j) {
            continue;
          }
          let rD    = (colors[i][0] - colors[j][0]);
          let gD    = (colors[i][1] - colors[j][1]);
          let bD    = (colors[i][2] - colors[j][2]);
          let match = (rD * rD + gD * gD + bD * bD);
          if (match < minDist || bucketA === null) {
            minDist = match;
            bucketA = i;
            bucketB = j;
          }
        }
      }

      let bucketC = buckets[bucketA].concat(buckets[bucketB]);
      colors.splice(bucketB);
      colors.splice(bucketA);
      pushAvg(bucketC);
      uniqCol = new Set(colors);
      console.log("Unique colors after merge of closest two: " + uniqCol.size);
    }


    let cNum = 0;
    for (let c of uniqCol) {
      if (cNum > 14) {
        break;
      }
      console.log("Setting color " + cNum + " to " + c);
      draw.setPalette(cNum, c);
      cNum++;
    }
  };

  const onFile = async e => {
    setDataUrl(await new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onerror = () => {
        fr.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      fr.onload = (re) => {resolve(re.target.result);};
      setFileName(e.target.files[0].name);
      fr.readAsDataURL(e.target.files[0]);
    }));
    setFileLoaded(true);
  };

  const toggleView = () => setIsCropping(!isCropping);

  // const tryAgain = () => {
  //   filesRef.current.click();
  // };

  const getAspectRatio = () => muralWide / muralTall;

  draw.patternType  = patternType;
  draw.authorStrict = 'Sean';

  useEffect(() => {
    draw.addCanvas(postViewRef.current);
  }, []);

  return (
    <>
      <div>
        <input type="file" ref={filesRef} accept="image/*" onChange={onFile}/>
        {/*<div className="cropper-container" v-show="isCropping"> */}
        {/*<div className="outercropper"><Cropper :src="dataurl" :stencilProps="{aspectRatio: 1}" :defaultPositon="getDefaultPosition" :defaultSize="getDefaultSize" ref="cropper" @change="onCrop" /></div>*/}
        <button onClick={toggleView}>Next</button>
      </div>
      <div className="preview-and-options">

        Preview:
        <canvas ref={previewRef}/>

        Postview:
        <canvas ref={postViewRef} width="64" height="64"/>

        Postmix:
        <canvas ref={postMixRef} className="postview" width="256" height="256"/>
      </div>
    </>
  );
};

export default ImageLoader;
