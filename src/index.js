// @flow
import 'babel-polyfill';

global.__DEV__ = process.env.NODE_ENV !== 'production';
global.Promise = require('bluebird');
require('./app');
