// @flow
import React from 'react';
import { Panel, Button } from 'react-toolbox';
import Permissions from 'Helper/Permissions';
import RoomsService from 'Service/Rooms';
import LoginService from 'Service/Login';
import Room from './Room';


@Permissions('canCreateRoom', 'canDeleteRoom')
export default class RoomAdmin extends React.PureComponent {
  componentWillMount() {
    RoomsService.getRooms();
  }
  createRoom = () => {
    RoomsService.createRoom();
  };
  render() {
    const rooms = RoomsService.rooms;
    const user = LoginService.user;
    return (
      <Panel>
        {user.role.canCreateRoom && (
          <Button
            raised
            accent
            onClick={this.createRoom}
            label="Create New Room"/>
        )}
        <Panel>
          {rooms.map(r => (
            <Room key={r.id} room={r}/>
          )).toArray()}
        </Panel>
      </Panel>
    );
  }
}
