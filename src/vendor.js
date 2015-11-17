import './fonts.css';
import axios from 'axios';
import UUID from 'uuid-js';
import Notifications from 'Services/notifications';

UUID.create = function(old) {
  return function() {
    const uuid = old.apply(this, arguments);
    return uuid.hex;
  };
}(UUID.create);

axios.interceptors.request.use(requestConfig => {
  requestConfig.url = `api${requestConfig.url}`;
  return requestConfig;
});

axios.interceptors.response.use(response => response.data, response => {
  const data = response.data;
  if (data.message) {
    Notifications.addError({ title: data.title, message: data.message });
  }
  return Promise.reject(response);
});
global._ = require('lodash');
global.Promise = require('bluebird');
require('babel-runtime/core-js/promise').default = global.Promise;
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
