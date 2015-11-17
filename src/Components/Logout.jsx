import React from 'react';
import User from '../Services/user';

export default class Logout extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }
  componentWillMount() {
    User.logout().then(() => {
      this.context.history.pushState(null, '/login');
    });
  }
  render() {
    return null;
  }
}
