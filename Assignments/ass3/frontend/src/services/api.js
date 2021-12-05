import axios from 'axios';
import localforage from 'localforage';
import url from './url';
import msgPopup from '../utils/msgPopup';
import { isEqual } from '../utils/lodash';

const instance = axios.create({
  baseURL: url,
  timeout: 10000,
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

instance.interceptors.request.use(async config => {
  const token = await localforage.getItem('token');
  if (!isEqual(token, null)) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => {
    if (isEqual(response.statusText, 'OK')) {
      return Promise.resolve(response.data);
    }
    return Promise.reject(response.data);
  },
  error => {
    msgPopup(error.response.data.error);
    return Promise.reject(error);
  },
);

export const GET = (getUrl, params, config = {}) =>
  new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url: getUrl,
      params,
      ...config,
    })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });

export const POST = (postUrl, payload, config = {}) =>
  new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url: postUrl,
      data: payload,
      ...config,
    })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });

export const PUT = (putUrl, payload, config = {}) =>
  new Promise((resolve, reject) => {
    instance({
      method: 'put',
      url: putUrl,
      data: payload,
      ...config,
    })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });

export const DELETE = (deleteUrl, config = {}) =>
  new Promise((resolve, reject) => {
    instance({
      method: 'delete',
      url: deleteUrl,
      ...config,
    })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
