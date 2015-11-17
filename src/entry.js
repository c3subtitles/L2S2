import './vendor';
import { render } from 'react-dom';
import React from 'react';
import routes from './routes';

global.isDev = process.env.NODE_ENV !== 'production';

if (global.isDev) {
  window.React = React;
}


setTimeout(() => {
  render(routes, document.querySelector('#l2s2'));
}, 500);
