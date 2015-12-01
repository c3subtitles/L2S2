import { addSuccess } from '../Services/notifications';
import { createAction } from 'redux-actions';
import { updateSessionId } from '../Services/socket';
import { List } from 'immutable';
import axios from 'axios';


export const logout = createAction('LOGOUT', async () => {
  try {
    await axios.post('/logout');
  } catch (e) {
    /* ignored */
  }
  delete localStorage.sessionId;
  return {};
});
export const login = createAction('LOGIN', async (username: string, password: string) => {
  const result = await axios.post('/login', {
    username,
    password,
  });
  localStorage.sessionId = result.sessionId;
  updateSessionId();
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
  return List(await axios.get('/users'));
});
export const fetchRoles = createAction('FETCH_ROLES', async () => {
  return List(await axios.get('/roles'));
});
export const saveRole = createAction('SAVE_ROLE', async (user: ClientUser, role: RoleType) => {
  user = await axios.put(`/users/${user.id}`, {
    role: role.id,
  });
  addSuccess({ message: 'Change Saved' });
  return user;
});
export const saveActive = createAction('SAVE_ACTIVE', async (user: ClientUser, active: bool) => {
  user = await axios.put(`/users/${user.id}`, {
    active,
  });
  addSuccess({ message: 'Change Saved' });
  return user;
});
export const deleteUser = createAction('DELETE_USER', async (user: ClientUser) => {
  await axios.delete(`/users/${user.id}`);
  addSuccess({ message: `${user.username} successfully deleted` });
  return user.id;
});
