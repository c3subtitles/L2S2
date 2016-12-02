// @flow
import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';
import Home from './Home';
import NavBar from './NavBar';
import Login from './Login';
import { Panel, Layout } from 'react-toolbox';
import { style } from 'glamor';

const mainLayout = style({
  marginTop: 15,
  marginLeft: 15,
  marginRight: 15,
});

export default () => (
  <BrowserRouter>
    <Layout>
      <Panel>
        <NavBar/>
        <Panel className={`${mainLayout}`}>
          <Match exactly pattern="/" component={Home}/>
          <Match pattern="/Login" component={Login}/>
          <Miss component={Home} />
        </Panel>
      </Panel>
    </Layout>
  </BrowserRouter>
);
