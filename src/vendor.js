import './fonts.css';
import axios from 'axios';
import UUID from 'uuid-js';
import { addError } from './Services/notifications';
import { sessionId } from './Services/user';

UUID.create = function(old) {
  return function() {
    const uuid = old.apply(this, arguments);
    return uuid.hex;
  };
}(UUID.create);

axios.interceptors.request.use(requestConfig => {
  requestConfig.url = `api${requestConfig.url}`;
  requestConfig.headers.sessionId = sessionId;
  return requestConfig;
});

axios.interceptors.response.use(response => response.data, response => {
  const data = response.data;
  if (data.message) {
    addError({ title: data.title, message: data.message });
  }
  return Promise.reject(response);
});
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
