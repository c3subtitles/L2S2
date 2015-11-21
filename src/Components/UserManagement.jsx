import { Permission } from '../Helper';
import { user, getUsers, getRoles } from '../Services/user';
import React from 'react';
import UserLine from './UserLine';
import _ from 'lodash';


@Permission('canActivateUser', 'canDeleteUser')
export default class UserManagement extends React.Component {
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
  };
  state: { users: Array<ClientUser>, availableRoles: Array<RoleType> } = {
    availableRoles: [],
    users: [],
  };
  componentWillMount() {
    getUsers().then((users: Array<ClientUser>) => {
      this.setState({
        users: _.sortBy(users, 'username'),
      });
    });
    if (user.role.canChangeUserRole) {
      getRoles().then(roles => {
        this.setState({
          availableRoles: roles,
        });
      });
    }
  }
  render() {
    const { users, availableRoles } = this.state;
    const style = UserManagement.style;
    return (
      <div style={style.wrapper}>
        {
          users.map(user => <UserLine key={user.username} availableRoles={availableRoles} user={user}/>)
        }
      </div>
    );
  }
}
