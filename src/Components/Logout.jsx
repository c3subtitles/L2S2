import React from 'react';
import { logout } from '../Actions/user';

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
