import { PureRender } from 'Helper';
import { TextField, RaisedButton } from 'material-ui';
import Notifications from 'Services/notifications';
import React from 'react';
import User from 'Services/user';

@PureRender
export default class Register extends React.Component {
  static style = {
    wrapper: {
      display: 'flex',
    },
    innerWrap: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
  }
  register = async (e) => {
    e.preventDefault();
    if (this.loggingIn) {
      return;
    }
    this.loggingIn = true;
    let { username, email, password1, password2 } = this.refs;
    username = username.getValue();
    email = email.getValue();
    password1 = password1.getValue();
    password2 = password2.getValue();
    if (password1 !== password2) {
      Notifications.addError({ message: 'passwords do not match' });
    }
    try {
      await User.register(username, email, password1);
      _.each(this.refs, r => r.setValue(''));
    } finally {
      this.loggingIn = false;
    }
  }
  render() {
    const style = Register.style;
    return (
      <div style={style.wrapper}>
        <form onSubmit={this.login} style={style.innerWrap}>
          <TextField floatingLabelText="Username" ref="username"/>
          <TextField floatingLabelText="Email" ref="email" type="email"/>
          <TextField floatingLabelText="Password" ref="password1" type="password"/>
          <TextField floatingLabelText="Password" ref="password2" type="password"/>
          <RaisedButton type="submit" label="Register" primary onClick={this.register}/>
        </form>
      </div>
    );
  }
}
