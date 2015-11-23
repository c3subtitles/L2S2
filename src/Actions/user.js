import { addSuccess } from '../Services/notifications';
import { createAction } from 'redux-actions';
import axios from 'axios';


export const logout = createAction('LOGOUT', () => {
  delete localStorage.sessionId;
  axios.post('/logout');
  return {
    user: null,
    sessionId: null,
  };
});
export const login = createAction('LOGIN', async (username: string, password: string) => {
  const result = await axios.post('/login', {
    username,
    password,
  });
  localStorage.sessionId = result.sessionId;
  addSuccess({ title: 'Login successful' });
  return result;
});
export const fetchUser = createAction('FETCH_USER', async () => {
  if (localStorage.sessionId) {
    try {
      const userFromServer = await axios.post('/userForSessionId', {
        sessionId: localStorage['sessionId'],
      });
      if (userFromServer) {
        return {
          user: userFromServer,
          sessionId: localStorage.sessionId,
        };
      }
    } catch (e) {
      delete localStorage.sessionId;
    }
  }
  return {
    user: null,
    sessionId: null,
  };
});
export const fetchUsers = createAction('FETCH_USERS', async () => {
  return await axios.get('/getUsers');
});
export const fetchRoles = createAction('FETCH_ROLES', async () => {
  return await axios.get('/role/getAll');
});
export const saveRole = createAction('SAVE_ROLE', async (user: ClientUser, role: RoleType) => {
  await axios.post('/saveRole', {
    user,
    role,
  });
  addSuccess({ message: 'Change Saved' });
  user.role = role;
  return user;
});
export const saveActive = createAction('SAVE_ACTIVE', async (user: ClientUser, active: bool) => {
  await axios.post('/saveActive', {
    user,
    active,
  });
  addSuccess({ message: 'Change Saved' });
  user.active = active;
  return user;
});
export const deleteUser = createAction('DELETE_USER', async (user: ClientUser) => {
  await axios.post('/deleteUser', { user });
  addSuccess({ message: `${user.username} successfully deleted` });
  return user.id;
});
