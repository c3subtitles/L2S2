import { addSuccess } from '../Services/notifications';
import { loggedIn, login } from '../Services/user';
import { TextField, RaisedButton } from 'material-ui';
import React from 'react';

export default class Login extends React.Component {
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
  };
  static contextTypes = {
    history: React.PropTypes.object,
  };
  componentWillMount() {
    if (loggedIn()) {
      this.context.history.pushState(null, '/write');
    }
  }
  login = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { username, password } = this.refs;
    await login(username.getValue(), password.getValue());
    this.context.history.pushState(null, '/write');
    addSuccess({ title: 'Login successful' });
  };
  render() {
    const style = Login.style;
    return (
      <div style={style.wrapper}>
        <form onSubmit={this.login} style={style.innerWrap}>
          <TextField floatingLabelText="Username" ref="username"/>
          <TextField floatingLabelText="Password" ref="password" type="password"/>
          <RaisedButton type="submit" label="Login" primary onClick={this.login}/>
        </form>
      </div>
    );
  }
}
