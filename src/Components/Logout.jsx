// @flow
import React from 'react';
import { logout } from '../Actions/user';
import { Permission } from '../Helper';
import { Redirect } from 'react-router';

@Permission()
export default class Logout extends React.Component {
  componentWillMount() {
    logout();
  }
  render() {
    return <Redirect to="/"/>;
  }
}
