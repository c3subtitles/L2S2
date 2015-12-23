require('./vendor');
require('../server/src/flowWorkarounds');
require('./flowWorkarounds');

const render = require('react-dom').render;
const React = require('react');
const routes = require('./routes').default;

global.isDev = process.env.NODE_ENV !== 'production';

if (global.isDev) {
  window.React = React;
}

setTimeout(() => {
  render(routes, document.querySelector('#l2s2'));
}, 500);
