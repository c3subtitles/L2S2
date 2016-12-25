// @flow
/* eslint no-nested-ternary: 0 */
import { Connect } from '../Helper';
import { deleteUser, saveRole, saveActive } from '../Actions/user';
import { Dialog, Paper, SelectField, MenuItem } from 'material-ui';
import { List } from 'immutable';
import DeleteButton from './DeleteButton';
import React from 'react';
import Radium from 'radium';

type State = {
  showDelete: bool,
}

const props = state => ({
  availableRoles: state.roles,
  ownUser: state.user,
});

type Props = {
  availableRoles?: List<Role>,
  ownUser?: ClientUser,
  user?: ClientUser,
};

@Connect(props)
@Radium
export default class UserLine extends React.Component {
  props: Props;
  static style = {
    wrapper: {
      display: 'flex',
      marginBottom: 10,
      alignItems: 'center',
      padding: 5,
    },
    col: {
      flex: '1 1 0',
      margin: 5,
    },
  };
  state: State = {
    showDelete: false,
  };
  handleActiveChange = (e: SyntheticEvent, index: number, value: bool) => {
    const { user } = this.props;
    saveActive(user, value);
  };
  handleRoleChange = (e: SyntheticEvent, index: number, menuItem: Object) => {
    const { user } = this.props;
    saveRole(user, menuItem.payload);
  };
  handleDelete = () => {
    this.setState({ showDelete: true });
  };
  hideDelete = () => {
    this.setState({ showDelete: false });
  };
  delete = () => {
    this.setState({ showDelete: false });
    deleteUser(this.props.user);
  };
  render() {
    const style = UserLine.style;
    const { availableRoles, user, ownUser } = this.props;
    if (!user || !availableRoles || !ownUser || !user.role) {
      return null;
    }
    const { showDelete } = this.state;
    const selectedRole = availableRoles.findIndex(r => r.name === user.role.name);
    const dialogOptions = [{
      text: 'Cancel',
    }, {
      text: 'Delete',
      onClick: this.delete,
      ref: 'delete',
    }];
    return (
      <Paper zDepth={2} style={style.wrapper}>
        <div style={style.col}>{user.username}</div>
        <div style={style.col}>
          {
            ownUser.role.canActivateUser ? (
              <SelectField value={user.active} onChange={this.handleActiveChange}>
                <MenuItem value primaryText="active"/>
                <MenuItem value={false} primaryText="inactive"/>
              </SelectField>
            ) : (user.active ? 'active' : 'inactive')
          }
        </div>
        <div style={style.col}>
          {
            ownUser.role.canChangeUserRole && selectedRole !== -1 ? (
              <SelectField value={selectedRole} onChange={this.handleRoleChange}>
                {
                  availableRoles.map((r, index) => (
                    <MenuItem key={index} value={index} primaryText={r.name}/>
                  ))
                }
              </SelectField>
            ) : user.role.name
          }
        </div>
        {ownUser.role.canDeleteUser && ownUser.id === user.id ? <div style={style.col}/> : [
          <DeleteButton style={style.col} key="d" label="Delete" onClick={this.handleDelete}/>,
          <Dialog key="dd"
            open={showDelete}
            onRequestClose={this.hideDelete}
            actions={dialogOptions}>
            Are you sure you want to delete {user.username}
          </Dialog>,
        ]}
      </Paper>
    );
  }
}
