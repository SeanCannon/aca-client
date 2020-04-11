import jsonOrError            from '../_helpers/jsonOrError';
import handleError            from '../_helpers/handleError';
import makeUploadFetchOptions from '../_helpers/makeUploadFetchOptions';
import getApiRoot             from '../_helpers/getApiRoot';

const uploadImage = data => (dispatch, getState) => {
  const url = getApiRoot() + '/api/v1/upload/image';

  const fetchOptions = {
    method  : 'POST',
    body    : data,
  };

  return fetch(url, makeUploadFetchOptions(fetchOptions))
    .then(jsonOrError('Upload an image'))
    .then(res => {
      console.log('upload res = ', res);

      dispatch({
        type : 'service.Upload.uploadImage',
        data : res.data
      });
    })
    .catch(handleError);
};

export default uploadImage;
