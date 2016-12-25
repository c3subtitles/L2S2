// @flow
/* eslint prefer-rest-params: 0 */
import './fonts.css';
import { addError } from './Services/notifications';
import axios from 'axios';
// import MaterialUI from 'material-ui';
// import Radium from 'radium';


// MaterialUI.Paper = Radium(MaterialUI.Paper);
axios.interceptors.request.use(requestConfig => {
  requestConfig.url = `/api${requestConfig.url}`;
  let sessionId;
  if (store) {
    sessionId = store.getState().sessionId;
  }
  // $FlowFixMe
  requestConfig.headers.sessionId = sessionId;
  return requestConfig;
});

axios.interceptors.response.use(undefined, response => {
  // $FlowFixMe
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
