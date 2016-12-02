// @flow

import 'react-toolbox/lib/commons.scss';
import './fonts.css';

global.__DEV__ = process.env.NODE_ENV !== 'production';

if (__DEV__) {
  // global.Perf = require('react-addons-perf');
  global.React = require('react');
  global.ReactDOM = require('react-dom');
}
