import { addSuccess } from '../Services/notifications';
import { createAction } from 'redux-actions';
import axios from 'axios';

export const fetchRooms = createAction('FETCH_ROOMS', async () => {
  return await axios.get('/rooms/all');
});

export const createRoom = createAction('CREATE_ROOM', async (name) => {
  const room = await axios.post('/rooms/create', {
    name,
  });
  addSuccess({ message: `${name} successfully created` });
  return room;
});

export const deleteRoom = createAction('DELETE_ROOM', async (id) => {
  await axios.post('/rooms/delete', { id });
  addSuccess({ message: `Successfully deleted` });
  return id;
});
