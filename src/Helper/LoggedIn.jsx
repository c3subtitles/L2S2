// @flow
import LoginService from 'Service/Login';
import { Redirect } from 'react-router';
import React from 'react';
import { observer } from 'mobx-react';


export default function(target: any) {
  @observer
  class LoggedIn extends target {
    render() {
      if (!LoginService.loggedIn) {
        return (
          <Redirect to="/"/>
        );
      }
      return super.render();
    }
  }
  return LoggedIn;
}
