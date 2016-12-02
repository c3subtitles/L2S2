/* @flow */
import { CSS, Connect } from '../Helper';
import { fetchUser } from '../Actions/user';
import { setSystem } from '../Services/notifications';
import GlobalCSS from './Global.CSS';
import Navbar from './Navbar';
import NotificationSystem from 'react-notification-system';
import Radium from 'radium';
import React from 'react';

type Props = {
  children?: any,
  dispatch?: Function,
  loggedIn?: bool,
  ready?: bool,
  user?: ClientUser,
}

@CSS(GlobalCSS)
@Connect(state => ({ ready: state.initialized }))
@Radium
export default class L2S2 extends React.Component<void, Props, void> {
  static _globalCSS = true;
  static contextTypes = {
    router: React.PropTypes.any,
  };
  static childContextTypes = {
    transitionTo: React.PropTypes.func,
  };
  static style = {
    childWrap: {
      display: 'flex',
      flex: '1 1 0',
      WebkitFlex: '1 1 0',
      WebkitFlexDirection: 'column',
    },
  };
  getChildContext(): Object {
    return {
      transitionTo: url => {
        this.context.router.push({ pathname: url });
      },
    };
  }
  componentWillMount() {
    fetchUser(this.context.router.location.token);
  }
  componentDidMount() {
    setSystem(this.refs.notification);
  }
  render() {
    const { children, ready } = this.props;
    const { router } = this.context;
    const clean = router.location.query.clean != null;
    const style = L2S2.style;
    return (
      <div>
        <NotificationSystem ref="notification"/>
        {ready && [
          clean ? null : (<Navbar key="nav"/>),
          <div key="wrap" style={style.childWrap}>
            {children}
          </div>,
        ]}
      </div>
    );
  }
}
