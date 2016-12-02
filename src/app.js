// @flow

require('./vendor');


const render = require('react-dom').render;
const React = require('react');
const L2S2 = require('./Components/L2S2').default;

setTimeout(() => {
  render(<L2S2/>, document.querySelector('#l2s2'));
}, 500);
