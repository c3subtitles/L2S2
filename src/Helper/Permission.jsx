// @flow
import { hasPermission } from '../Services/user';
import React from 'react';
import { Redirect } from 'react-router';


export function Permission(...permissions: Array<string>): Function {
  return function(component) {
    return class Permission extends component {
      static displayName = component.displayName || component.name;
      render() {
        if (!hasPermission(permissions)) {
          return <Redirect to="/"/>;
        }
        return super.render();
      }
    };
  };
}
