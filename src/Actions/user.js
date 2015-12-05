/* @flow */

import { addSuccess } from '../Services/notifications';
import { createAction } from 'redux-actions';
import { Map, List } from 'immutable';
import { updateSessionId } from '../Services/socket';
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

export const fetchUser = createAction('FETCH_USER', async (token: ?string) => {
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
  if (token) {
    try {
      const tokenResult = await axios.post('/userForToken', {
        token,
      });
      if (tokenResult && tokenResult.sessionId) {
        localStorage.sessionId = tokenResult.sessionId;
        tokenResult.user.fromToken = true;
        return {
          user: tokenResult.user,
          sessionId: tokenResult.sessionId,
        };
      }
    } catch (e) {
      /* ignored */
    }
  }
  return {
    user: null,
    sessionId: null,
  };
});
export const fetchUsers = createAction('FETCH_USERS', async () => {
  const users = await axios.get('/users');
  let userMap: Map<number, ClientUser> = Map();
  users.forEach(user => {
    userMap = userMap.set(user.id, user);
  });
  return userMap;
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

export const resetPassword = createAction('RESET_PW', async (email: string) => {
  await axios.post(`/users/resetPassword`, {
    email,
  });
});
