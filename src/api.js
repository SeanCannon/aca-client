import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const activeRequests = {};

const makeRequestId = () => uuidv4();

const getAxiosInstance = () => {
  const config = {
    baseURL : process.env.REACT_APP_API_ROOT,
    timeout : 60000,
    headers : {
      'cache-control' : 'no-store, no-cache, must-revalidate'
    }
  };

  const Api = axios.create(config);

  Api.interceptors.request.use(reqConfig => {
    const updatedReqConfig = { ...reqConfig };
    const requestId = makeRequestId();

    updatedReqConfig.headers['x-request-id'] = requestId;

    activeRequests[requestId] = updatedReqConfig;

    return updatedReqConfig;
  });

  Api.interceptors.response.use(
    response => {
      const { data } = response;

      if (data.data && data.data.err) {
        throw data.data.err;
      }

      return response || undefined;
    },
    error => {
      return new Promise((resolve, reject) => {
        // TODO dispatch for UI notice.
        /* eslint-disable-next-line */
        console.error(error);
        reject(error);
      });
    }
  );

  return Api;
};

const Api = getAxiosInstance();

const search = axiosInstance => async ({ strategy }) => {
  const { data: { data } } = await axiosInstance.get(`/v1/art/${strategy}/search`);
  return data;
};

const getItemById = axiosInstance => async ({ strategy, itemId }) => {
  const { data: { data } } = await axiosInstance.get(`/v1/art/${strategy}/item/${itemId}`);
  return data;
};

const getItemsByIds = axiosInstance => async ({ strategy, itemIds }) => {
  const { data: { data } } = await axiosInstance.post(`/v1/art/${strategy}/items`, { itemIds });
  return data;
};

const ArtSvc = {
  search,
  getItemById,
  getItemsByIds
};

export {
  Api,
  ArtSvc
};
