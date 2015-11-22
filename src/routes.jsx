import { createHistory } from 'history';
import { Router, Route } from 'react-router';
import App from './Components/App';
import Login from './Components/Login';
import Logout from './Components/Logout';
import Profile from './Components/Profile';
import React from 'react';
import Register from './Components/Register';
import UserManagement from './Components/UserManagement';
import WriteInterface from './Components/WriteInterface';

export default (
  <Router history={createHistory()}>
    <Route path="/" component={App}>
      <Route path="write" component={WriteInterface}/>
      <Route path="login" component={Login}/>
      <Route path="logout" component={Logout}/>
      <Route path="profile" component={Profile}/>
      <Route path="register" component={Register}/>
      <Route path="userManagement" component={UserManagement}/>
      <Route path="*" component={Register}/>
    </Route>
  </Router>
);
