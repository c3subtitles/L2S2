// @flow
import './vendor';
import { render } from 'react-dom';
import React from 'react';
import L2S2 from 'Components/L2S2';
import { AppContainer } from 'react-hot-loader';


render(
  <AppContainer>
    <L2S2/>
  </AppContainer>
  , document.getElementById('l2s2')
);

if (module.hot) {
  // $FlowFixMe
  module.hot.accept('Components/L2S2', () => {
    const Component = require('Components/L2S2').default;
    render(
      <AppContainer>
        <Component/>
      </AppContainer>,
      document.getElementById('l2s2')
    );
  });
}
