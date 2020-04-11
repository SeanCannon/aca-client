import uploadImage from './uploadImageThunk';

const resources = {
  uploadImage : {
    uri    : '/api/v1/upload/image',
    method : 'POST'
  }
};

export {
  resources,
  uploadImage
}
