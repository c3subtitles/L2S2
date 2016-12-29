// @flow
require('./vendor');
require('./animation.css');


const render = require('react-dom').render;
const React = require('react');
const App = require('./Components/App').default;

global.isDev = process.env.NODE_ENV !== 'production';

if (global.isDev) {
  window.React = React;
}

require('./autocomplete');
setTimeout(() => {
  render(<App/>, document.querySelector('#l2s2'));
}, 500);
