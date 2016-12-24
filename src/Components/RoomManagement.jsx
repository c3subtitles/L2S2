// @flow
import { createRoom, fetchRooms } from '../Actions/rooms';
import { Permission, Connect } from '../Helper';
import { RaisedButton } from 'material-ui';
import { Map } from 'immutable';
import React from 'react';
import Room from './Room';

const props = state => ({
  rooms: state.rooms,
  user: state.user,
});

type Props = {
  rooms: Map,
  user: Object,
};

@Permission('canCreateRoom', 'canDeleteRoom')
@Connect(props)
export default class RoomManagement extends React.Component<void, Props, void> {
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
    return (
      <div style={style.wrapper}>
        {user.role.canCreateRoom && (
          <RaisedButton primary style={style.new} onClick={createRoom} label="New Room"/>
        )}
        {
          rooms.toList().map((room, index) => <Room key={room.id || `i${index}`} room={room}/>).toArray()
        }
      </div>
    );
  }
}
