/* @flow */
import { addError } from 'Services/notifications';
import { PureRender } from 'Helper';
import { register } from 'Services/user';
import { TextField, RaisedButton } from 'material-ui';
import React from 'react';
import { Connect } from '../Helper';

type Props = {
  loggedIn: bool,
};

/*::`*/
@PureRender
@Connect()
/*::`*/
export default class Register extends React.Component<void, Props, void> {
  static contextTypes = {
    transitionTo: React.PropTypes.func,
  };
  static style = {
    wrapper: {
      display: 'flex',
    },
    innerWrap: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
    },
  };
  componentWillMount() {
    const { loggedIn } = this.props;
    if (loggedIn) {
      this.context.transitionTo('/');
    }
  }
  loggingIn: bool = false;
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
      addError({ message: 'passwords do not match' });
    }
    try {
      await register(username, email, password1);
      this.refs.each(r => r.setValue(''));
      this.context.transitionTo('/');
    } finally {
      this.loggingIn = false;
    }
  };
  render(): ReactElement {
    const style = Register.style;
    return (
      <div style={style.wrapper}>
        <form onSubmit={this.register} style={style.innerWrap}>
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
