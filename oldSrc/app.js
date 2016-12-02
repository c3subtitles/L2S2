require('./vendor');


const render = require('react-dom').render;
const routes = require('./routes').default;


setTimeout(() => {
  render(routes, document.querySelector('#l2s2'));
}, 500);
