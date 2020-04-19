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
      resolve(blob);
    }, 'image/jpeg');
    // eslint-disable-next-line no-console
  }).catch(error => console.log('Blob error: ', error));
};

export {
  getImageDimensionsBasedOnMax,
  createCropPreview,
  DEFAULT_CROP,
  getBase64
};
