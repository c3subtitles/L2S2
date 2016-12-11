// @flow
import React from 'react';
import { AppBar, Navigation, Button } from 'react-toolbox';
import { Link } from 'react-router';
import LoginService from 'Service/LoginService';
import { observer } from 'mobx-react';

@observer
export default class Navbar extends React.PureComponent {
  anonymousLinks() {
    return [
      <Link key="l" to="/Login">
        <Button>
          Login
        </Button>
      </Link>,
      <Link key="r" to="/Register">
        <Button>
          Register
        </Button>
      </Link>,
    ];
  }
  links() {
    return [
      <div key="u">
        {LoginService.user.username}
      </div>,
    ];
  }
  render() {
    return (
      <AppBar title="L2S2">
        <Navigation type="horizontal">
          {LoginService.loggedIn ? this.links() : this.anonymousLinks()}
        </Navigation>
      </AppBar>
    );
  }
}
