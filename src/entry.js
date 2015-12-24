import 'babel-regenerator-runtime';
global.Promise = require('bluebird');
require('../babelHelper');
require('./polyfill');
require('./app');
