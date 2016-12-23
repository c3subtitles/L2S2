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
  @observable users: Map<number, ClientUser>;
  @observable lines: List<string>;
  async joinRoom(roomId: number, write: bool = false) {
    joinRoomSocket(roomId);
    if (joinRoomTimeout) {
      clearTimeout(joinRoomTimeout);
    }
    joinRoomTimeout = setTimeout(() => joinRoomCheck(roomId), 2500);
    const room = (await axios.get(`/api/rooms/${roomId}/${write ? 'join' : 'joinRead'}`)).data;
    if (room.userInRoom) {
      let userInRoom: Map<number, ClientUser> = Map();
      room.userInRoom.forEach(u => {
        userInRoom = userInRoom.set(u.id, u);
      });
      this.users = userInRoom;
    }
    this.lines = List(room.lines);
    this.room = room;
    this.roomId = roomId;
  }
  async leaveRoom(roomId: number) {
    leaveRoomSocket(roomId);
    if (joinRoomTimeout) {
      clearTimeout(joinRoomTimeout);
    }
  }
  lineUpdate(roomId: number, userId: number, text: string) {
    if (this.roomId !== roomId) {
      return;
    }
    const user = this.users.get(userId);
    if (!user) {
      return;
    }
    user.current = text;
    this.users = this.users.set(userId, user);
  }
  line(roomId: number, text: string, color: string) {
    if (this.roomId !== roomId) {
      return;
    }
    this.lines = this.lines.push(text);
  }
}

export default new RoomService();
