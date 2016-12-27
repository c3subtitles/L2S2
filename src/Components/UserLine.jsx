// @flow
/* eslint no-nested-ternary: 0 */
import { Connect } from '../Helper';
import { deleteUser, saveRole, saveActive } from '../Actions/user';
import { Dialog, Paper, SelectField, MenuItem, FlatButton } from 'material-ui';
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
      alignItems: 'center',
      display: 'flex',
      marginBottom: 10,
      padding: 5,
      flexShrink: 0,
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
  handleRoleChange = (e: SyntheticEvent, index: number, roleId: number) => {
    const { user } = this.props;
    saveRole(user, roleId);
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
    const selectedRole = availableRoles.find(r => r.name === user.role.name);
    if (!selectedRole) {
      return null;
    }
    const dialogOptions = [(
      <FlatButton label="Cancel" onClick={this.hideDelete}/>
    ), (
      <FlatButton label="Delete" onClick={this.delete}/>
    )];
    return (
      <Paper zDepth={2} style={style.wrapper}>
        <div style={style.col}>{user.username}</div>
        <div style={style.col}>
          {
            ownUser.role.canActivateUser ? (
              <SelectField value={Boolean(user.active)} onChange={this.handleActiveChange}>
                <MenuItem value primaryText="active"/>
                <MenuItem value={false} primaryText="inactive"/>
              </SelectField>
            ) : (user.active ? 'active' : 'inactive')
          }
        </div>
        <div style={style.col}>
          {
            ownUser.role.canChangeUserRole ? (
              <SelectField value={selectedRole.id} onChange={this.handleRoleChange}>
                {
                  availableRoles.map((r, index) => (
                    <MenuItem key={index} value={r.id} primaryText={r.name}/>
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
