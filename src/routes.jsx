import { createHistory } from 'history';
import { Router, Route, Redirect } from 'react-router';
import App from './Components/App';
import Login from './Components/Login';
import Logout from './Components/Logout';
import Profile from './Components/Profile';
import React from 'react';
import ReadSelection from './Components/ReadSelection';
import ReadInterface from './Components/ReadInterface';
import Register from './Components/Register';
import RoomManagement from './Components/RoomManagement';
import UserManagement from './Components/UserManagement';
import WriteInterface from './Components/WriteInterface';
import WriteSelection from './Components/WriteSelection';

export default (
  <Router history={createHistory()}>
    <Route component={App}>
      <Route path="/" component={ReadSelection}/>
      <Route path="/write" component={WriteSelection}/>
      <Route path="/write/:roomId" component={WriteInterface}/>
      <Route path="/login" component={Login}/>
      <Route path="/logout" component={Logout}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/register" component={Register}/>
      <Route path="/userManagement" component={UserManagement}/>
      <Route path="/RoomManagement" component={RoomManagement}/>
      <Route path="/:roomId" component={ReadInterface}/>
      <Redirect from="*" to="/"/>
    </Route>
  </Router>
);
