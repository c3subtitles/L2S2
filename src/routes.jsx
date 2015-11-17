import { createHistory } from 'history';
import { Router, Route } from 'react-router';
import L2S2 from 'Components/L2S2';
import Login from 'Components/Login';
import Logout from 'Components/Logout';
import Profile from 'Components/Profile';
import React from 'react';
import WriteInterface from 'Components/WriteInterface';

export default (
  <Router history={createHistory()}>
    <Route path="/" component={L2S2}>
      <Route path="write" component={WriteInterface}/>
      <Route path="login" component={Login}/>
      <Route path="logout" component={Logout}/>
      <Route path="profile" component={Profile}/>
    </Route>
  </Router>
);
