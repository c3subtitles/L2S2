import { createRoom, fetchRooms } from '../Actions/rooms';
import { Permission, Connect } from '../Helper';
import { RaisedButton } from 'material-ui';
import React from 'react';
import Room from './Room';

const props = state => ({
  rooms: state.rooms,
  user: state.user,
});

@Permission('canCreateRoom', 'canDeleteRoom')
@Connect(props)
export default class RoomManagement extends React.Component {
  static propTypes = {
    rooms: React.PropTypes.arrayOf(React.PropTypes.object),
    user: React.PropTypes.object,
  };
  static style = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    new: {
      marginBottom: 15,
    },
  };
  componentWillMount() {
    fetchRooms();
  }
  render() {
    const { rooms, user } = this.props;
    const style = RoomManagement.style;
    console.log(rooms);
    return (
      <div style={style.wrapper}>
        {user.role.canCreateRoom && (
          <RaisedButton primary style={style.new} onClick={createRoom} label="New Room"/>
        )}
        {
          rooms.map((room, index) => <Room key={room.id || room.name || index} room={room}/>)
        }
      </div>
    );
  }
}
