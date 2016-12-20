// @flow
import React from 'react';
import { observer } from 'mobx-react';
import LoginService from 'Service/Login';
import { Input, Button, Panel, Dialog } from 'react-toolbox';
import RoomsService from 'Service/Rooms';
import { StyleSheet, css } from 'aphrodite';

type Props = {
  room: Room,
}

type State = {
  name: string,
  deleteDialog: bool,
};

@observer
export default class RoomEdit extends React.PureComponent {
  props: Props;
  state: State = {
    name: this.props.room.name,
    deleteDialog: false,
  };
  handleBlur = (e: SyntheticEvent) => {
    const { room } = this.props;
    // $FlowFixMe
    const newName = e.target.value;
    if (room.name !== newName) {
      room.name = newName;
      RoomsService.saveRoom(room);
    }
  };
  handleName = (name: string) => {
    this.setState({
      name,
    });
  };
  inputRef = (input: Input) => {
    const { room } = this.props;
    if (!room.id && input) {
      setTimeout(() => {
        input.getWrappedInstance().focus();
      });
    }
  };
  deleteDialog = () => {
    this.setState({
      deleteDialog: !this.state.deleteDialog,
    });
  };
  delete = () => {
    const { room } = this.props;
    RoomsService.delete(room);
  };
  render() {
    const user = LoginService.user;
    const { room } = this.props;
    const { name, deleteDialog } = this.state;
    return (
      <Panel className={css(styles.wrapper)}>
        {user.role.canCreateRoom ? (
          <Input className={css(styles.input)}
            ref={this.inputRef}
            value={name}
            onChange={this.handleName}
            onBlur={this.handleBlur} placeholder="Name"/>
        ) : (
          <div>{room.name}</div>
        )}
        {user.role.canDeleteRoom && [
          <Button accent
            key="d" label="Delete"
            onClick={this.deleteDialog}/>,
          <Dialog key="dd"
            actions={[{
              label: 'Cancel',
              onClick: this.deleteDialog,
            }, {
              label: 'Delete',
              accent: true,
              onClick: this.delete,
            }]}
            active={deleteDialog}
            onEscKeyDown={this.deleteDialog}
            onOverlayClick={this.deleteDialog}
            title="Delete">
              <p>Are you sure you want do delete Room {name}</p>
            </Dialog>,
        ]}
      </Panel>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
});
