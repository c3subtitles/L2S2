import { fetchUsers, fetchRoles } from '../Actions/user';
import { Permission, Connect } from '../Helper';
import React from 'react';
import UserLine from './UserLine';

const props = state => ({
  users: state.users,
  user: state.user,
});

@Permission('canActivateUser', 'canDeleteUser')
@Connect(props)
export default class UserManagement extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    users: React.PropTypes.arrayOf(ClientUser),
  }
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
  };
  componentWillMount() {
    fetchUsers();
    if (this.props.user.role.canChangeUserRole) {
      fetchRoles();
    }
  }
  render() {
    const { users } = this.props;
    const style = UserManagement.style;
    return (
      <div style={style.wrapper}>
        {
          users.map(user => <UserLine key={user.username} user={user}/>)
        }
      </div>
    );
  }
}
