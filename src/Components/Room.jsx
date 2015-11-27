import { Connect } from '../Helper';
import { Paper, Dialog, TextField } from 'material-ui';
import { deleteRoom, saveRoom } from '../Actions/rooms';
import DeleteButton from './DeleteButton';
import React from 'react';
import Radium from 'radium';

const props = state => ({
  user: state.user,
});

@Radium
@Connect(props)
export default class Room extends React.Component {
  static propTypes = {
    room: React.PropTypes.object,
    user: React.PropTypes.object,
  };
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
  state = {
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
  }
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
      room.name = name.getValue();
      saveRoom(room);
    }
  };
  render() {
    const { user, room } = this.props;
    const { showDelete } = this.state;
    const style = Room.style;
    const dialogOptions = [{
      text: 'Cancel',
    }, {
      text: 'Delete',
      onClick: this.delete,
      ref: 'delete',
    }];
    return (
      <Paper zDepth={2} style={style.wrapper}>
        {user.role.canCreateRoom ? (
          <TextField ref="name" onBlur={this.handleBlur} style={style.col} defaultValue={room.name} placeholder="Name"/>
        ) : (<div style={style.col}>{room.name}</div>)}
        {user.role.canDeleteRoom && [
          <DeleteButton style={style.col} key="d" label="Delete" onClick={this.handleDelete}/>,
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
