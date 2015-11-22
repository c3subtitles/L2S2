import { TextField, RaisedButton } from 'material-ui';
import { login } from '../Actions/user';
import { Connect } from '../Helper';
import React from 'react';

@Connect()
export default class Login extends React.Component {
  static propTypes = {
    loggedIn: React.PropTypes.bool,
  };
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
