// @flow
import React from 'react';
import { AppBar, Navigation, Button, Menu, MenuItem } from 'react-toolbox';
import { Link } from 'react-router';
import LoginService from 'Service/Login';
import { observer } from 'mobx-react';

type State = {
  menu: bool,
}

@observer
export default class Navbar extends React.PureComponent {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };
  state: State = {
    menu: false,
  };
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
  toggleMenu = () => {
    this.setState({
      menu: !this.state.menu,
    });
  };
  hideMenu = () => {
    this.setState({
      menu: false,
    });
  };
  onSelect = (value: string) => {
    const { router } = this.context;
    router.transitionTo(`/${value}`);
  };
  links() {
    const { menu } = this.state;
    return [
      <Button key="u" onClick={this.toggleMenu}>
        {LoginService.user.username}
        <Menu
          onSelect={this.onSelect}
          onHide={this.hideMenu}
          active={menu}
          menuRipple
          position="topLeft">
          <MenuItem value="RoomAdmin" caption="Room Admin"/>
          <MenuItem value="Logout" caption="Logout"/>
        </Menu>
      </Button>,
    ];
  }
  render() {
    return (
      <AppBar title={<Link to="/">L2S2</Link>}>
        <Navigation type="horizontal">
          {LoginService.loggedIn ? this.links() : this.anonymousLinks()}
        </Navigation>
      </AppBar>
    );
  }
}
