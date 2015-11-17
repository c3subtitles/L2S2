import React from 'react';
import User from '../Services/user';

export default class PermissionWrap extends React.Component {
  static propTypes = {
    children: React.PropTypes.any.isRequired,
    permission: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.arrayOf(React.PropTypes.string),
    ]).isRequired,
  }
  render() {
    const { permission, children } = this.props;
    if (User.hasPermission(permission)) {
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
