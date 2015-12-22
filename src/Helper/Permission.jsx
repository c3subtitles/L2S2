/* @flow */
import { hasPermission } from '../Services/user';
import React from 'react';


export function Permission(...permissions: Array<string>): Function {
  return function(component) {
    return class Permission extends component {
      static displayName = component.displayName || component.name;
      static contextTypes = Object.assign({}, component.contextTypes, {
        history: React.PropTypes.object,
      });
      componentWillMount() {
        if (!hasPermission(permissions)) {
          this.context.history.pushState(null, '/');
          this.unauth = true;
          return;
        }

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }
      render() {
        if (this.unauth) {
          return null;
        }
        return super.render();
      }
    };
  };
}
