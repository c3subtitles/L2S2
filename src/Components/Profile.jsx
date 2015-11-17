import { TextField, RaisedButton } from 'material-ui';
import Notifications from '../Services/notifications';
import React from 'react';
import User from '../Services/user';

export default class Profile extends React.Component {
  changePassword = (e) => {
    e.preventDefault();
    let { oldpw, newpw1, newpw2 } = this.refs;
    newpw1 = newpw1.getValue();
    newpw2 = newpw2.getValue();
    if (newpw1 !== newpw2) {
      Notifications.addError({ message: 'Passwords did not match' });
      return;
    }
    oldpw = oldpw.getValue();
    User.changePassword(oldpw, newpw1);
    oldpw.setValue();
    newpw1.setValue();
    newpw2.setValue();
  }
  render() {
    return (
      <div>
        <h2>Change Password</h2>
        <form onSubmit={this.changePassword}>
          <TextField floatingLabelText="Current Password" type="password" ref="oldpw"/>
          <TextField floatingLabelText="New Password" ref="newpw1" type="password"/>
          <TextField floatingLabelText="Password Confirmation" ref="newpw2" type="password"/>
          <RaisedButton type="submit" label="Change" primary onClick={this.changePassword}/>
        </form>
      </div>
    );
  }
}
