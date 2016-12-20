// @flow
import React from 'react';
import { Panel, Input, Button, Dialog } from 'react-toolbox';
import LoginService from 'Service/Login';
import { StyleSheet, css } from 'aphrodite';
import { addInfo } from 'Service/Notifications';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router';

type State = {
  username: string,
  password: string,
  passwordDialog: bool,
  resetMail: string,
}

@observer
export default class Login extends React.PureComponent {
  state: State = {
    username: '',
    password: '',
    passwordDialog: false,
    resetMail: '',
  };
  handleUsernameChange = (value: string) => {
    this.setState({ username: value });
  };
  handlePasswordChange = (value: string) => {
    this.setState({ password: value });
  };
  handleResetMail = (value: string) => {
    this.setState({ resetMail: value });
  };
  login = (e: SyntheticEvent) => {
    // $FlowFixMe
    if (e.target.form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      const { username, password } = this.state;
      LoginService.login(username, password);
    }
  };
  passwordDialog = () => {
    this.setState({
      passwordDialog: !this.state.passwordDialog,
    });
  };
  resetPassword = () => {
    const { resetMail } = this.state;
    LoginService.resetPassword(resetMail);
    this.passwordDialog();
    addInfo({
      message: 'Please check your email',
    });
  };
  render() {
    if (LoginService.loggedIn) {
      return (
        <Redirect to="/"/>
      );
    }
    const { username, password, passwordDialog, resetMail } = this.state;
    return (
      <form onSubmit={this.login}>
        <h3>Login</h3>
        <Panel>
          <Input type="text" label="Username" onChange={this.handleUsernameChange} value={username} required/>
          <Input type="password" label="Password" onChange={this.handlePasswordChange} value={password} required/>
          <div className={css(style.buttonGroup)}>
            <Button primary type="submit" onClick={this.login}>Login</Button>
            <Button onClick={this.passwordDialog}>Password forgotten</Button>
            <Dialog
              actions={[{
                label: 'Cancel',
                onClick: this.passwordDialog,
              }, {
                label: 'Reset Password',
                primary: true,
                onClick: this.resetPassword,
              }]}
              active={passwordDialog}
              onEscKeyDown={this.passwordDialog}
              onOverlayClick={this.passwordDialog}
              title="Password reset">
              <p>Plase enter your Email Address.</p>
              <Input type="email" label="Email" onChange={this.handleResetMail} value={resetMail}/>
            </Dialog>
          </div>
        </Panel>
      </form>
    );
  }
}

const style = StyleSheet.create({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
  },
});
