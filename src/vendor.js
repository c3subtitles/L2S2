import './fonts.css';
import { addError } from './Services/notifications';
import axios from 'axios';
import MaterialUI from 'material-ui';
import Radium from 'radium';
import UUID from 'uuid-js';

MaterialUI.Paper = Radium(MaterialUI.Paper);

UUID.create = function(old) {
  return function() {
    const uuid = old.apply(this, arguments);
    return uuid.hex;
  };
}(UUID.create);

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
