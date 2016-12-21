// @flow
import { observable } from 'mobx';
import { List, Map } from 'immutable';
import { joinRoom as joinRoomSocket, leaveRoom as leaveRoomSocket } from 'Service/Socket';
import axios from 'axios';

let joinRoomTimeout;
function joinRoomCheck(roomId: number) {
  joinRoomSocket(roomId);
}

class RoomService {
  roomId: number = -1;
  @observable room: Room;
  async joinRoom(roomId: number, write: bool = false) {
    joinRoomSocket(roomId);
    if (joinRoomTimeout) {
      clearTimeout(joinRoomTimeout);
    }
    joinRoomTimeout = setTimeout(() => joinRoomCheck(roomId), 2500);
    const room = (await axios.get(`/api/rooms/${roomId}/${write ? 'join' : 'joinRead'}`)).data;
    if (room.userInRoom) {
      let userInRoom: Map<number, User> = Map();
      room.userInRoom.forEach(u => {
        userInRoom = userInRoom.set(u.id, u);
      });
      room.userInRoom = userInRoom;
    }
    room.lines = List(room.lines);
    this.room = room;
    this.roomId = roomId;
  }
  async leaveRoom(roomId: number) {
    leaveRoomSocket(roomId);
    if (joinRoomTimeout) {
      clearTimeout(joinRoomTimeout);
    }
  }
}

export default new RoomService();
