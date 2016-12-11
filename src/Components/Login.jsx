// @flow
import React from 'react';
import { Panel, Input, Button } from 'react-toolbox';
import LoginService from 'Service/LoginService';

type State = {
  username: string,
  password: string,
}

export default class Login extends React.PureComponent {
  state: State = {
    username: '',
    password: '',
  };
  handleUsernameChange = (value: string) => {
    this.setState({ username: value });
  };
  handlePasswordChange = (value: string) => {
    this.setState({ password: value });
  };
  login = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { username, password } = this.state;
    LoginService.login(username, password);
  };
  render() {
    const { username, password } = this.state;
    return (
      <form onSubmit={this.login}>
        <h3>Login</h3>
        <Panel>
          <Input type="text" label="Username" onChange={this.handleUsernameChange} value={username}/>
          <Input type="password" label="Password" onChange={this.handlePasswordChange} value={password}/>
          <Button type="submit" onClick={this.login}>Login</Button>
        </Panel>
      </form>
    );
  }
}
