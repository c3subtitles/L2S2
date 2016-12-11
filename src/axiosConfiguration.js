// @flow
import axios from 'axios';

function sessionIdInterceptor(config) {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId && config.headers) {
    config.headers.sessionId = sessionId;
  }
  return config;
}

axios.interceptors.request.use(sessionIdInterceptor);
