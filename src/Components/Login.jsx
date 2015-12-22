/* @flow */
/* $FlowFixMe */
import 'sweetalert/dist/sweetalert.css';
import { Connect } from '../Helper';
import { login, resetPassword } from '../Actions/user';
import { TextField, RaisedButton } from 'material-ui';
import React from 'react';
import swal from 'sweetalert';

type Props = {
  loggedIn: bool,
};

/*::`*/
@Connect()
/*::`*/
export default class Login extends React.Component<void, Props, void> {
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
    pwForgotten: {
      marginTop: 15,
      transform: 'scale(0.75)',
    },
  };
  static contextTypes = {
    history: React.PropTypes.object,
  };
  componentWillMount() {
    this.checkStatus();
  }
  componentDidUpdate() {
    this.checkStatus();
  }
  checkStatus = () => {
    if (this.props.loggedIn) {
      this.context.history.pushState(null, '/write');
    }
  };
  login = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { username, password } = this.refs;
    login(username.getValue(), password.getValue());
  };
  resetPassword = () => {
    swal({
      closeOnCancel: false,
      closeOnConfirm: false,
      confimButtonColor: '#DD6B55',
      confirmButtonText: 'Reset Password',
      showCancelButton: true,
      text: 'Please enter your email Address',
      title: 'Password Reset',
      type: 'input',
    }, inputValue => {
      if (inputValue) {
        const emailRegex: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(inputValue)) {
          swal.showInputError('Please enter a valid email Address');
          return;
        }
        resetPassword(inputValue);
        swal('Password Resetted', 'Please Check your mail', 'success');
      } else if (inputValue === '') {
        swal.showInputError('Please enter your email Address');
      } else {
        swal('Cancelled', 'Guess you remembered your password. Good for you!', 'error');
      }
    });
  };
  render(): ReactElement {
    const style = Login.style;
    return (
      <div style={style.wrapper}>
        <form onSubmit={this.login} style={style.innerWrap}>
          <TextField floatingLabelText="Username" ref="username"/>
          <TextField floatingLabelText="Password" ref="password" type="password"/>
          <RaisedButton type="submit" label="Login" primary onClick={this.login}/>
          <RaisedButton style={style.pwForgotten} label="Password forgotten" secondary onClick={this.resetPassword}/>
        </form>
      </div>
    );
  }
}
