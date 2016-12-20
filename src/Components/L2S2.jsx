// @flow
import { BrowserRouter, Match, Miss } from 'react-router';
import { Panel, Layout } from 'react-toolbox';
import { setSystem } from 'Service/Notifications';
import { StyleSheet, css } from 'aphrodite';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import NavBar from './NavBar';
import NotificationSystem from 'react-notification-system';
import React from 'react';
import Register from './Register';
import RoomAdmin from './RoomAdmin';
import Read from './Read';
import LoginService from 'Service/Login';


const style = StyleSheet.create({
  main: {
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    overflow: 'auto',
    flex: 1,
  },
  notification: {
    position: 'absolute',
  },
  panel: {
    justifyContent: 'initial',
  },
});

type State = {
  init: bool,
};

export default class L2S2 extends React.PureComponent {
  state: State = {
    init: false,
  };
  componentWillMount() {
    LoginService.initPromise.then(() => {
      this.setState({
        init: true,
      });
    });
  }
  componentDidMount() {
    setSystem(this.refs.notification);
  }
  render() {
    const { init } = this.state;
    return (
      <BrowserRouter>
        <Layout>
          <Panel className={css(style.panel)}>
            <div className={css(style.notification)}>
              <NotificationSystem ref="notification"/>
            </div>
            <NavBar/>
            {init && (
              <div className={css(style.main)}>
                <Match exactly pattern="/" component={Home}/>
                <Match pattern="/Login" component={Login}/>
                <Match pattern="/Logout" component={Logout}/>
                <Match pattern="/Register" component={Register}/>
                <Match pattern="/RoomAdmin" component={RoomAdmin}/>
                <Match pattern="/:id" component={Read}/>
                <Miss component={Home} />
              </div>
            )}
          </Panel>
        </Layout>
      </BrowserRouter>
    );
  }
}
