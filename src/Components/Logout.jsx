import React from 'react';
import { logout } from '../Services/user';

export default class Logout extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  };
  componentWillMount() {
    logout().then(() => {
      this.context.history.pushState(null, '/login');
    });
  }
  render() {
    return null;
  }
}
