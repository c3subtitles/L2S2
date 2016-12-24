// @flow
import { CSS, Connect } from '../Helper';
import { fetchUser } from '../Actions/user';
import { setSystem } from '../Services/notifications';
import GlobalCSS from './Global.CSS';
import Navbar from './Navbar';
import NotificationSystem from 'react-notification-system';
import Radium from 'radium';
import React from 'react';
import Routes from './Routes';

type Props = {
  dispatch?: Function,
  loggedIn?: bool,
  ready?: bool,
  user?: ClientUser,
  location?: RouterLocation,
}

@CSS(GlobalCSS)
@Connect(state => ({ ready: state.initialized }))
@Radium
export default class L2S2 extends React.Component {
  props: Props;
  static _globalCSS = true;
  static style = {
    childWrap: {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
    },
  };
  componentWillMount() {
    fetchUser(this.props.location && this.props.location.query && this.props.location.query.token);
  }
  componentDidMount() {
    setSystem(this.refs.notification);
  }
  render() {
    const { ready } = this.props;
    const style = L2S2.style;
    return (
      <div style={style.childWrap}>
        <NotificationSystem ref="notification"/>
        {ready && [
          <Navbar key="nav"/>,
          <div key="wrap" style={style.childWrap}>
            {Routes}
          </div>,
        ]}
      </div>
    );
  }
}
