import { AppBar, IconMenu, RaisedButton } from 'material-ui';
import { globalEventEmitter } from 'Helper';
import MenuDivider from 'material-ui/lib/menus/menu-divider';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Radium from 'radium';
import React from 'react';
import User from '../Services/user';


@Radium
export default class Navbar extends React.Component {
  static contextTypes = {
    transitionTo: React.PropTypes.func.isRequired,
  }
  static style = {
    bar: {
      lineHeight: '48px',
      minHeight: 48,
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: 0,
      paddingTop: 0,
      letterSpacing: 0,
      fontSize: 24,
      fontWeight: 400,
      color: '#fff',
      flex: 1,
    },
    menu: {
      marginTop: 0,
    },
    menuButton: {
      boxShadow: 'initial',
      height: 'initial',
    },
    menuButtonLabel: {
      color: '#fff',
    },
  }
  componentWillMount() {
    globalEventEmitter.on('login', this.handleLoginLogout);
    globalEventEmitter.on('logout', this.handleLoginLogout);
  }
  handleLoginLogout = () => {
    this.forceUpdate();
  }
  profile = () => {
    this.context.transitionTo('/profile');
  }
  logout = () => {
    this.context.transitionTo('/logout');
  }
  rooms = () => {
    this.context.transitionTo('/rooms');
  }
  users = () => {
    this.context.transitionTo('/users');
  }
  render() {
    const style = Navbar.style;
    let iconElementRight;
    if (User.loggedIn()) {
      iconElementRight = (
        <IconMenu desktop iconButtonElement={
            <RaisedButton style={style.menuButton} secondary label={User.user.username}/>
          }>
          <MenuItem onClick={this.profile} primaryText="Profile"/>
          <MenuDivider/>
          {User.hasPermission(['canCreateRoom', 'canDeleteRoom']) &&
            <MenuItem onClick={this.rooms} primaryText="Rooms"/>}
          {User.hasPermission(['canCreateUser', 'canDeleteUser', 'canActivateUser']) &&
            <MenuItem onClick={this.users} primaryText="Usermanagement"/>}
          {User.hasPermission(['canCreateRoom', 'canDeleteRoom', 'canCreateUser', 'canDeleteUser', 'canActivateUser']) && <MenuDivider/>}
          <MenuItem primaryText="Logout" onClick={this.logout}/>
        </IconMenu>
      );
    }
    return (
      <AppBar style={style.bar} iconStyleRight={style.menu} showMenuIconButton={false} title={<h1 style={style.title}>L2S2</h1>} iconElementRight={iconElementRight}/>
    );
  }
}
