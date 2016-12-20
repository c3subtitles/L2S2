// @flow
import React from 'react';
import { Redirect } from 'react-router';
import LoginService from 'Service/Login';
import { addSuccess } from 'Service/Notifications';

export default class Logout extends React.PureComponent {
  componentWillMount() {
    LoginService.logout();
    addSuccess({ message: 'Successfully logged out ' });
  }
  render() {
    return (
      <Redirect to="/"/>
    );
  }
}
