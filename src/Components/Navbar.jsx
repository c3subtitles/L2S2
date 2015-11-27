import { AppBar, IconMenu, RaisedButton, FlatButton } from 'material-ui';
import { Connect } from '../Helper';
import MenuDivider from 'material-ui/lib/menus/menu-divider';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Radium from 'radium';
import React from 'react';
import { hasPermission } from '../Services/user';


@Radium
@Connect(state => ({
  currentRoom: state.currentRoom,
  readMode: state.read,
  user: state.user,
}))
export default class Navbar extends React.Component {
  static propTypes = {
    currentRoom: React.PropTypes.object,
    loggedIn: React.PropTypes.bool,
    readMode: React.PropTypes.bool,
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
      flex: '1 1 0',
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: 0,
      margin: 0,
      overflow: 'hidden',
      paddingTop: 0,
      position: 'relative',
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
    room: {
      marginLeft: 10,
      marginRight: 10,
    },
    writeButton: {
      height: '75%',
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
    },
  };
  home: () => void = () => {
    this.context.transitionTo('/');
  };
  write: () => void = () => {
    this.context.transitionTo('/write');
  };
  writeRoom = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { currentRoom } = this.props;
    if (currentRoom) {
      this.context.transitionTo(`/write/${currentRoom.id}`);
    } else {
      this.write();
    }
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
  login: () => void = () => {
    this.context.transitionTo('/login');
  };
  getGuestMenu() {
    const style = Navbar.style;
    return (
      <IconMenu desktop iconButtonElement={
          <RaisedButton style={style.menuButton} secondary label="Menu"/>
        }>
        <MenuItem onClick={this.login} primaryText="Login"/>
      </IconMenu>
    );
  }
  getTitle() {
    const style = Navbar.style;
    const { currentRoom, loggedIn, readMode } = this.props;
    return (
      <h1 onClick={this.home} style={style.title}>
        L2S2{currentRoom && [<span key="s" style={style.room}> - </span>, currentRoom.name]}
        {loggedIn && readMode && (
          <FlatButton backgroundColor="transparent" hoverColor="rgba(255, 255, 255, 0.4)" onClick={this.writeRoom} style={style.writeButton} label="Write"/>
        )}
      </h1>
    );
  }
  render() {
    const { loggedIn, user } = this.props;
    const style = Navbar.style;
    let iconElementRight;
    if (loggedIn) {
      const conditionalMenu = [];
      if (hasPermission(['canCreateRoom', 'canDeleteRoom'])) {
        conditionalMenu.push(<MenuItem key="r" onClick={this.rooms} primaryText="Rooms"/>);
      }
      if (hasPermission(['canCreateUser', 'canDeleteUser', 'canActivateUser'])) {
        conditionalMenu.push(<MenuItem key="u" onClick={this.users} primaryText="Usermanagement"/>);
      }
      if (conditionalMenu.length > 0) {
        conditionalMenu.push(<MenuDivider key="d"/>);
      }
      iconElementRight = (
        <IconMenu desktop iconButtonElement={
            <RaisedButton style={style.menuButton} secondary label={user.username}/>
          }>
          <MenuItem onClick={this.profile} primaryText="Profile"/>
          <MenuItem onClick={this.write} primaryText="Write"/>
          <MenuDivider/>
          {conditionalMenu}
          <MenuItem primaryText="Logout" onClick={this.logout}/>
        </IconMenu>
      );
    } else {
      iconElementRight = this.getGuestMenu();
    }
    return (
      <AppBar style={style.bar} iconStyleRight={style.menu} showMenuIconButton={false} title={this.getTitle()} iconElementRight={iconElementRight}/>
    );
  }
}
