import 'babel-regenerator-runtime';
global.Promise = require('bluebird');
require('../../babelHelper');
require('babel-polyfill');
require('./app');
