// @flow
import React from 'react';
import { Panel, Input, Button } from 'react-toolbox';
import LoginService from 'Service/Login';
import { addError, addSuccess } from 'Service/Notifications';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router';

type state = {
  username: string,
  pw: string,
  pwr: string,
  email: string,
}

@observer
export default class Register extends React.PureComponent {
  state: state = {
    username: '',
    pw: '',
    pwr: '',
    email: '',
  };
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  handleChange(name: string, value: string) {
    this.setState({
      [name]: value,
    });
  }
  register = (e: SyntheticEvent) => {
    // $FlowFixMe
    if (e.target.form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      const { username, pw, pwr, email } = this.state;
      if (!username || !pw || !pwr || !email || (pw !== pwr)) {
        addError({ message: 'Please fill out all fields' });
        return;
      }
      LoginService.register(username, pw, email).then(() => {
        addSuccess({ message: `Successfully registered as ${username}` });
        this.context.router.transitionTo('/');
      });
    }
  };
  render() {
    if (LoginService.loggedIn) {
      return (
        <Redirect to="/"/>
      );
    }
    const { username, pw, pwr, email } = this.state;
    return (
      <form onSubmit={this.register}>
        <h3>Register</h3>
        <Panel>
          <Input type="text" label="Username" onChange={this.handleChange.bind(this, 'username')} value={username} required/>
          <Input type="password" label="Password" onChange={this.handleChange.bind(this, 'pw')} value={pw} required/>
          <Input type="password" label="Repeat Password" onChange={this.handleChange.bind(this, 'pwr')} value={pwr} required/>
          <Input type="email" label="Email" onChange={this.handleChange.bind(this, 'email')} value={email} required/>
          <Button type="submit" onClick={this.register}>Register</Button>
        </Panel>
      </form>
    );
  }
}
