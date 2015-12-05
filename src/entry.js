global.Promise = require('bluebird');
require('babel-runtime/core-js/promise').default = require('bluebird');
require('./app');
