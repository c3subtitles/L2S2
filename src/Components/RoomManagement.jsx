// @flow
import { createRoom, fetchRooms } from '../Actions/rooms';
import { Permission, Connect } from '../Helper';
import { RaisedButton } from 'material-ui';
import { Map } from 'immutable';
import React from 'react';
import RoomComponent from './Room';

const props = state => ({
  rooms: state.rooms,
  user: state.user,
});

type Props = {
  rooms?: Map<number, Room>,
  user?: Object,
};

@Permission('canCreateRoom', 'canDeleteRoom')
@Connect(props)
export default class RoomManagement extends React.Component {
  props: Props;
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
        {user && user.role.canCreateRoom && (
          <RaisedButton primary style={style.new} onClick={createRoom} label="New Room"/>
        )}
        {
          rooms && rooms.map((room, index) => <RoomComponent key={room.id || `i${index}`} room={room}/>).toArray()
        }
      </div>
    );
  }
}
