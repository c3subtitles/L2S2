import { addSuccess } from '../Services/notifications';
import { createAction } from 'redux-actions';
import axios from 'axios';

export const fetchRooms = createAction('FETCH_ROOMS', async () => {
  return await axios.get('/rooms/all');
});

export const saveRoom = createAction('SAVE_ROOM', async (room) => {
  room = await axios.post('/rooms/save', { room });
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
    await axios.post('/rooms/delete', { id: room.id });
  }
  addSuccess({ message: `Successfully deleted` });
  return room;
});

export const joinRoom = createAction('JOIN_ROOM', async roomId => {
  return await axios.post('/rooms/join', { id: roomId });
});
