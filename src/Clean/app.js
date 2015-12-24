require('../../server/src/flowWorkarounds');
require('../flowWorkarounds');


const render = require('react-dom').render;
const React = require('react');

global.isDev = process.env.NODE_ENV !== 'production';

if (global.isDev) {
  window.React = React;
}

const Read = require('./Read').default;

setTimeout(() => {
  render(<Read/>, document.querySelector('#l2s2'));
}, 500);
