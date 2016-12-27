// @flow
import { fetchUsers, fetchRoles } from '../Actions/user';
import { Map } from 'immutable';
import { Permission, Connect } from '../Helper';
import React from 'react';
import UserLine from './UserLine';

const props = state => ({
  users: state.users,
  user: state.user,
});

type Props = {
  user?: Object,
  users?: Map<any, any>,
};

@Permission('canActivateUser', 'canDeleteUser')
@Connect(props)
export default class UserManagement extends React.Component {
  props: Props;
  static style = {
    wrapper: {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
      overflow: 'auto',
    },
  };
  componentWillMount() {
    fetchUsers();
    const { user } = this.props;
    if (user && user.role.canChangeUserRole) {
      fetchRoles();
    }
  }
  render() {
    const { users } = this.props;
    const style = UserManagement.style;
    return (
      <div style={style.wrapper}>
        {
          users && users.sortBy(user => user.username.toLowerCase()).map(user => <UserLine key={user.id} user={user}/>).toArray()
        }
      </div>
    );
  }
}
