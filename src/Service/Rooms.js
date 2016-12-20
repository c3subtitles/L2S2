// @flow
import { observable } from 'mobx';
import { Map } from 'immutable';
import axios from 'axios';
import { addSuccess, addWarning } from './Notifications';

class RoomsService {
  @observable rooms: Map<number, Room> = Map();
  constructor() {
    this.getRooms();
  }
  async getRooms() {
    const rooms = (await axios.get('/api/rooms')).data;
    rooms.forEach(r => {
      this.rooms = this.rooms.set(r.id, r);
    });
  }
  createRoom() {
    this.rooms = this.rooms.set(0, ({
      name: '',
    }: any));
  }
  async saveRoom(room: Room) {
    let newRoom;
    if (room.id) {
      newRoom = (await axios.put(`/api/rooms/${room.id}`, {
        name: room.name,
      })).data;
    } else {
      this.rooms = this.rooms.delete(0);
      newRoom = (await axios.post('/api/rooms', {
        room,
      })).data;
    }
    this.rooms = this.rooms.set(newRoom.id, newRoom);
  }
  async delete(room: Room) {
    if (!room.id) {
      this.rooms = this.rooms.delete(0);
      return;
    }
    const oldRoom = this.rooms.get(room.id);
    this.rooms = this.rooms.delete(room.id);
    try {
      await axios.delete(`/api/rooms/${room.id}`);
    } catch (e) {
      this.rooms = this.rooms.set(oldRoom.id, oldRoom);
    }
  }
}

const service = new RoomsService();

if (__DEV__) {
  global.Rooms = service;
}

export default service;
