import React from 'react';
import { Connect } from '../Helper';
import { joinRoom } from '../Actions/rooms';

const props = state => ({
  user: state.user,
  userInRoom: state.userInRoom,
  room: state.currentRoom,
});

@Connect(props)
export default class WriteInterface extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      roomId: React.PropTypes.string,
    }),
    room: React.PropTypes.object,
    user: React.PropTypes.object,
  };
  componentWillMount() {
    const { roomId } = this.props.params;
    joinRoom(roomId);
  }
  render() {
    const { room } = this.props;
    return (
      <div>{room.name}</div>
    );
  }
}
