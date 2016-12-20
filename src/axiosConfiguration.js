// @flow
import axios from 'axios';
import { addError } from 'Service/Notifications';

function sessionIdInterceptor(config) {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId && config.headers) {
    config.headers.sessionId = sessionId;
  }
  return config;
}

function errorHandler(response) {
  // $FlowFixMe
  const data = response.response.data;
  if (data.message) {
    if (data.message === 'Expired Session') {
      const LoginService = require('Service/Login').default;
      LoginService.sessionId = null;
    }
    addError({ message: data.message });
  } else {
    addError({ message: 'Unknown Error' });
  }
  return Promise.reject(response);
}

axios.interceptors.request.use(sessionIdInterceptor, errorHandler);
axios.interceptors.response.use(undefined, errorHandler);
