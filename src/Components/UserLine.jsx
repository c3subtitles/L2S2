import { addSuccess } from '../Services/notifications';
import { Paper, DropDownMenu } from 'material-ui';
import { user as ownUser, saveRole, saveActive } from '../Services/user';
import React from 'react';

export default class UserLine extends React.Component {
  static propTypes = {
    availableRoles: React.PropTypes.arrayOf(RoleType),
    user: React.PropTypes.instanceOf(ClientUser),
  };
  static style = {
    wrapper: {
      display: 'flex',
      marginBottom: 10,
      alignItems: 'center',
    },
    col: {
      flex: 1,
      margin: 5,
    },
  }
  handleActiveChange = async (e: SyntheticEvent, index: number, menuItem: Object) => {
    const { user } = this.props;
    await saveActive(user, menuItem.payload);
    addSuccess({ message: 'Change Saved' });
  };
  handleRoleChange = async (e: SyntheticEvent, index: number, menuItem: Object) => {
    const { user } = this.props;
    await saveRole(user, menuItem.payload);
    addSuccess({ message: 'Change Saved' });
  };
  render() {
    const style = UserLine.style;
    const { availableRoles, user } = this.props;
    const activeDropdownOptions = {
      menuItems: [{ payload: true, text: 'active' }, { payload: false, text: 'inactive' }],
      selectedIndex: user.active ? 0 : 1,
      onChange: this.handleActiveChange,
    };
    const selectedRole = availableRoles.findIndex(r => r.name === user.role.name);
    const roleOptions = {
      menuItems: availableRoles.map(r => ({ payload: r, text: r.name })),
      selectedIndex: selectedRole,
      onChange: this.handleRoleChange,
    };
    const isActive = (user.active ? 'active' : 'inactive');
    return (
      <Paper zDepth={2} style={style.wrapper}>
        <div style={style.col}>{user.username}</div>
        <div style={style.col}>
          {
            ownUser.role.canActivateUser ? (
              <DropDownMenu {...activeDropdownOptions}/>
            ) : isActive
          }
        </div>
        <div style={style.col}>
          {
            ownUser.role.canChangeUserRole && selectedRole !== -1 ? (
              <DropDownMenu {...roleOptions}/>
            ) : user.role.name
          }
        </div>
      </Paper>
    );
  }
}
