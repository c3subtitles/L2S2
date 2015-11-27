import { addSuccess } from '../Services/notifications';
import { createAction } from 'redux-actions';
import { joinRoom as joinRoomSocket, leaveRoom as leaveRoomSocket } from '../Services/socket';
import axios from 'axios';

export const fetchRooms = createAction('FETCH_ROOMS', async () => {
  return await axios.get('/rooms');
});

export const saveRoom = createAction('SAVE_ROOM', async (room) => {
  if (room.id) {
    room = await axios.put(`/rooms/${room.id}`, {
      name: room.name,
    });
  } else {
    room = await axios.post('/rooms', { room });
  }
  addSuccess({ message: 'Successfully saved' });
  return room;
});

export const createRoom = createAction('CREATE_ROOM', async () => {
  return {
    name: '',
    isNew: true,
  };
});

export const deleteRoom = createAction('DELETE_ROOM', async (room) => {
  if (!room.isNew) {
    await axios.delete(`/rooms/${room.id}`);
  }
  addSuccess({ message: `Successfully deleted` });
  return room;
});

export const joinRoom = createAction('JOIN_ROOM', async roomId => {
  joinRoomSocket(roomId);
  return await axios.get(`/rooms/join/${roomId}`);
});

export const leaveRoom = createAction('LEAVE_ROOM', roomId => {
  leaveRoomSocket(roomId);
  return roomId;
});

function lineUpdateFunc(roomId: number, userId: number, text: string) {
  return {
    roomId,
    userId,
    text,
  };
}

export const lineUpdate = createAction('LINE_UPDATE', lineUpdateFunc);

export const newLine = createAction('NEW_LINE', lineUpdateFunc);

export const userJoined = createAction('USER_JOINED', (roomId, user) => ({
  roomId,
  user,
}));

export const userLeft = createAction('USER_LEFT', (roomId, user) => ({
  roomId,
  user,
}));

export const joinReadRoom = createAction('JOIN_READ_ROOM', async roomId => {
  return await axios.get(`/rooms/joinRead/${roomId}`);
});

export const leaveReadRoom = createAction('LEAVE_READ_ROOM', () => {});
