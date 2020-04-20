/* eslint-disable */

const MAX_WIDTH_HEIGHT = 100;
const DEFAULT_CROP = {
  aspect : 1,
  unit: '%',
  height: 50,
  width: 50
};

const getImageDimensionsBasedOnMax = (width, height, maxWidthHeight) => {
  const ratio = Math.min(maxWidthHeight / width, maxWidthHeight / height);

  return { width: width * ratio, height: height * ratio };
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const createCropPreview = async (
  img,
  newCrop,
  fileName
) => {
  const canvas = document.createElement('canvas');
  const smallDimensions = getImageDimensionsBasedOnMax(newCrop.width, newCrop.height, MAX_WIDTH_HEIGHT);
  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;
  canvas.width = smallDimensions.width;
  canvas.height = smallDimensions.height;
  const ctx = canvas.getContext('2d');

  const left = newCrop.x * scaleX;
  const top = newCrop.y * scaleY;
  const width = newCrop.width * scaleX;
  const height = newCrop.height * scaleY;

  // debugger;
  ctx.drawImage(
    img,
    left,
    top,
    width,
    height,
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
      resolve({
        coordinates : { top, left, width, height },
        canvas,
        blob
      });
    }, 'image/jpeg');
    // eslint-disable-next-line no-console
  }).catch(error => console.log('Blob error: ', error));
};

const imageQuantize = ({ imageData, drawingToolInstance, convertTrans }) => {
  const pixelCount = imageData.data.length;
  const pixels = [];
  for (let i = 0; i < pixelCount; i += 4) {
    if (imageData.data[i + 3] < convertTrans * 2.55) {
      continue;
    }
    pixels.push({ r : imageData.data[i], g : imageData.data[i + 1], b : imageData.data[i + 2] });
  }

  const medianCut = pixels => {
    const l = Math.floor(pixels.length / 2);
    let r_min = null;
    let r_max = null;
    let g_min = null;
    let g_max = null;
    let b_min = null;
    let b_max = null;
    for (const i in pixels) {
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
    const r_dist = r_max - r_min;
    const g_dist = g_max - g_min;
    const b_dist = b_max - b_min;
    if (r_dist >= g_dist && r_dist >= b_dist) {
      pixels.sort((a, b) => (a.r - b.r));
    } else if (g_dist >= r_dist && g_dist >= b_dist) {
      pixels.sort((a, b) => (a.g - b.g));
    } else {
      pixels.sort((a, b) => (a.b - b.b));
    }
    return [pixels.slice(0, l), pixels.slice(l)];
  };
  const medianMultiCut = buckets => {
    const res = [];
    for (const i in buckets) {
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
  buckets = medianMultiCut(buckets);
  buckets = medianMultiCut(buckets);
  buckets = medianMultiCut(buckets);

  const colors = [];
  let uniqCol = new Set();

  const pushAvg = b => {
    let r_avg = 0;
    let g_avg = 0;
    let b_avg = 0;
    for (const i in b) {
      r_avg += b[i].r;
      g_avg += b[i].g;
      b_avg += b[i].b;
    }
    const rgb = [Math.round(r_avg / b.length), Math.round(g_avg / b.length), Math.round(b_avg / b.length)];
    const idx = drawingToolInstance.findRGB(rgb);
    if (!uniqCol.has(idx)) {
      colors.push(idx);
      uniqCol.add(idx);
    }
  };

  for (const i in buckets) {
    pushAvg(buckets[i]);
  }


  if (uniqCol.size < 15) {
    buckets = medianMultiCut(buckets);
    for (const i in buckets) {
      pushAvg(buckets[i]);
    }

    if (uniqCol.size < 15) {
      buckets = medianMultiCut(buckets);
      for (const i in buckets) {
        pushAvg(buckets[i]);
      }

      if (uniqCol.size < 15) {
        buckets = medianMultiCut(buckets);
        for (const i in buckets) {
          pushAvg(buckets[i]);
        }

      }
    }
  } else if (uniqCol.size > 15) {
    let minDist = 255 * 255 * 3;
    let bucketA = null;
    let bucketB = null;
    for (const i in colors) {
      for (const j in colors) {
        if (i >= j) {
          continue;
        }
        const rD = (colors[i][0] - colors[j][0]);
        const gD = (colors[i][1] - colors[j][1]);
        const bD = (colors[i][2] - colors[j][2]);
        const match = (rD * rD + gD * gD + bD * bD);
        if (match < minDist || bucketA === null) {
          minDist = match;
          bucketA = i;
          bucketB = j;
        }
      }
    }

    const bucketC = buckets[bucketA].concat(buckets[bucketB]);
    colors.splice(bucketB);
    colors.splice(bucketA);
    pushAvg(bucketC);
    uniqCol = new Set(colors);

  }


  let cNum = 0;
  for (const c of uniqCol) {
    if (cNum > 14) {
      break;
    }

    drawingToolInstance.setPalette(cNum, c);
    cNum++;
  }
};

export {
  getImageDimensionsBasedOnMax,
  createCropPreview,
  DEFAULT_CROP,
  getBase64,
  imageQuantize
};
