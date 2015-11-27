import React from 'react';
import { logout } from '../Actions/user';
import { Permission } from '../Helper';

@Permission()
export default class Logout extends React.Component {
  static contextTypes = {
    transitionTo: React.PropTypes.func.isRequired,
  };
  componentWillMount() {
    logout();
  }
  render() {
    return null;
  }
}
