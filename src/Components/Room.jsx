// @flow
import { Connect } from '../Helper';
import { Paper, Dialog, TextField, FlatButton } from 'material-ui';
import { deleteRoom, saveRoom } from '../Actions/rooms';
import DeleteButton from './DeleteButton';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  user: state.user,
});

type Props = {
  room: Room,
  user?: Object,
};

type State = {
  showDelete: bool,
};

@Radium
@Connect(props)
export default class RoomComponent extends React.Component {
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
  handleDelete = () => {
    const { room } = this.props;
    if (!room.name && room.isNew) {
      this.delete();
    } else {
      this.setState({ showDelete: true });
    }
  };
  hideDelete = () => {
    this.setState({ showDelete: false });
  };
  delete = () => {
    this.setState({ showDelete: false });
    deleteRoom(this.props.room);
  };
  componentDidMount() {
    const { room } = this.props;
    if (!room.name && this.refs.name) {
      this.refs.name.focus();
    }
  }
  handleBlur = () => {
    const { name } = this.refs;
    const { room } = this.props;
    const newName = name.getValue();
    if (room.name !== newName) {
      room.name = newName;
      saveRoom(room);
    }
  };
  render() {
    const { user, room } = this.props;
    if (!user) {
      return null;
    }
    const { showDelete } = this.state;
    const style = RoomComponent.style;
    const dialogOptions = [(
      <FlatButton label="Cancel" onClick={this.hideDelete}/>
    ), (
      <FlatButton label="Delete" onClick={this.hideDelete}/>
    )];
    return (
      <Paper zDepth={2} style={style.wrapper}>
        {user.role.canCreateRoom ? (
          <TextField name="n" ref="name" onBlur={this.handleBlur} style={style.col} defaultValue={room.name} placeholder="Name"/>
        ) : (<div style={style.col}>{room.name}</div>)}
        {user.role.canDeleteRoom && [
          <DeleteButton style={style.col} key="d" label="Delete" onClick={this.delete}/>,
          <Dialog key="dd"
            open={showDelete}
            onRequestClose={this.hideDelete}
            actions={dialogOptions}>
            Are you sure you want to delete {room.name}
          </Dialog>,
        ]}
      </Paper>
    );
  }
}
