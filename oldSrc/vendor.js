import './fonts.css';
import { addError } from './Services/notifications';
import axios from 'axios';
import UUID from 'uuid-js';


UUID.create = (function(old) {
  return function(...args) {
    const uuid = old.apply(this, ...args);
    return uuid.hex;
  };
}(UUID.create));

axios.interceptors.request.use(requestConfig => {
  requestConfig.url = `/api${requestConfig.url}`;
  let sessionId;
  if (store) {
    sessionId = store.getState().sessionId;
  }
  requestConfig.headers.sessionId = sessionId;
  return requestConfig;
});

axios.interceptors.response.use(response => response.data, response => {
  const data = response.data;
  if (data.message) {
    addError({ title: data.title, message: data.message });
  } else {
    addError({ message: 'Unknown Error' });
  }
  return Promise.reject(response);
});
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

if (__DEV__) {
  // global.Perf = require('react-addons-perf');
  global.React = require('react');
  global.ReactDOM = require('react-dom');
}
