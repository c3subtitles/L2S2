// @flow
import React from 'react';
import { Match, Miss } from 'react-router';
import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import ReadInterface from './ReadInterface';
import ReadSelection from './ReadSelection';
import Register from './Register';
import RoomManagement from './RoomManagement';
import Stats from './Stats';
import UserManagement from './UserManagement';
import WriteInterface from './WriteInterface';
import WriteSelection from './WriteSelection';

export default [
  <Match key="a" exactly pattern="/" component={ReadSelection}/>,
  <Match key="b" pattern="/:roomId" render={(matchProps) => (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Match exactly pattern="/write" component={WriteSelection}/>
        <Match pattern="/write/:roomId" component={WriteInterface}/>
        <Match exactly pattern="/login" component={Login}/>
        <Match exactly pattern="/logout" component={Logout}/>
        <Match exactly pattern="/profile" component={Profile}/>
        <Match exactly pattern="/register" component={Register}/>
        <Match exactly pattern="/userManagement" component={UserManagement}/>
        <Match exactly pattern="/RoomManagement" component={RoomManagement}/>
        <Match exactly pattern="/stats" component={Stats}/>
        <Miss render={() => <ReadInterface {...matchProps}/>}/>
      </div>
    )
  }/>,
<Miss key="c" component={ReadSelection}/>,
];
