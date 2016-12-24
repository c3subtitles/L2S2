// @flow
import React from 'react';
import { hasPermission } from '../Services/user';

type Props = {
  children: any,
  permission: string|Array<string>,
};

export default class PermissionWrap extends React.Component<void, Props, void> {
  render() {
    const { permission, children } = this.props;
    if (hasPermission(permission)) {
      if (React.Children.count(children) > 1) {
        return (
          <div>
            {children}
          </div>
        );
      }
      return children;
    }
    return null;
  }
}
