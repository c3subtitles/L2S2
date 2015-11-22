import { AppBar, IconMenu, RaisedButton } from 'material-ui';
import { Connect } from '../Helper';
import MenuDivider from 'material-ui/lib/menus/menu-divider';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Radium from 'radium';
import React from 'react';
import { hasPermission } from '../Services/user';


@Radium
@Connect(state => ({
  user: state.user,
}))
export default class Navbar extends React.Component {
  static propTypes = {
    loggedIn: React.PropTypes.bool,
    user: React.PropTypes.instanceOf(ClientUser),
  }
  static contextTypes = {
    transitionTo: React.PropTypes.func.isRequired,
  };
  static style = {
    bar: {
      lineHeight: '48px',
      minHeight: 48,
    },
    title: {
      color: '#fff',
      cursor: 'pointer',
      flex: 1,
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: 0,
      margin: 0,
      overflow: 'hidden',
      paddingTop: 0,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    menu: {
      alignSelf: 'center',
      marginTop: 0,
    },
    menuButton: {
      alignSelf: 'center',
      boxShadow: 'initial',
      height: 'initial',
    },
    menuButtonLabel: {
      color: '#fff',
    },
  };
  home: () => void = () => {
    this.context.transitionTo('/');
  };
  profile: () => void = () => {
    this.context.transitionTo('/profile');
  };
  logout: () => void = () => {
    this.context.transitionTo('/logout');
  };
  rooms: () => void = () => {
    this.context.transitionTo('/roomManagement');
  };
  users: () => void = () => {
    this.context.transitionTo('/userManagement');
  };
  render() {
    const { loggedIn, user } = this.props;
    const style = Navbar.style;
    let iconElementRight;
    if (loggedIn) {
      iconElementRight = (
        <IconMenu desktop iconButtonElement={
            <RaisedButton style={style.menuButton} secondary label={user.username}/>
          }>
          <MenuItem onClick={this.profile} primaryText="Profile"/>
          <MenuDivider/>
          {hasPermission(['canCreateRoom', 'canDeleteRoom']) &&
            <MenuItem onClick={this.rooms} primaryText="Rooms"/>}
          {hasPermission(['canCreateUser', 'canDeleteUser', 'canActivateUser']) &&
            <MenuItem onClick={this.users} primaryText="Usermanagement"/>}
          {hasPermission(['canCreateRoom', 'canDeleteRoom', 'canCreateUser', 'canDeleteUser', 'canActivateUser']) && <MenuDivider/>}
          <MenuItem primaryText="Logout" onClick={this.logout}/>
        </IconMenu>
      );
    }
    return (
      <AppBar style={style.bar} iconStyleRight={style.menu} showMenuIconButton={false} title={<h1 onClick={this.home} style={style.title}>L2S2</h1>} iconElementRight={iconElementRight}/>
    );
  }
}
