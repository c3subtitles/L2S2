
import _ from 'lodash';
import { addSuccess, addError } from './notifications';
import { globalEventEmitter } from '../Helper/index';
import axios from 'axios';

export let sessionId: ?string = null;
export let user: ?ClientUser = null;
export async function login(username: string, password: string): string {
  const result = await axios.post('/login', {
    username,
    password,
  });
  localStorage['sessionId'] = sessionId = result.sessionId;
  user = result.user;
  globalEventEmitter.emit('login');
  return sessionId;
}

export function loggedIn(): bool {
  return Boolean(user);
}

export async function logout(): void {
  if (!loggedIn()) {
    return;
  }
  delete localStorage['sessionId'];
  await axios.post('/logout', {
    sessionId,
  });
  sessionId = null;
  user = null;
  globalEventEmitter.emit('logout');
}

export function hasPermission(permission: string|Array<string>): bool {
  if (!user) {
    return false;
  }
  const permissions = _.isArray(permission) ? permission : [permission];
  return _.some(permissions, p => user && user.role[p]);
}

export async function loadFromLocalstorage(): ?ClientUser {
  if (localStorage.sessionId) {
    try {
      const userFromServer = await axios.post('/userForSessionId', {
        sessionId: localStorage['sessionId'],
      });
      if (userFromServer) {
        user = userFromServer;
        sessionId = localStorage['sessionId'];
        return user;
      }
      throw new Error('invalidSession');
    } catch (e) {
      sessionId = null;
      user = null;
      globalEventEmitter.emit('logout');
    }
  }
}

export async function changePassword(oldPassword: string, newPassword: string): void {
  if (user) {
    try {
      await axios.post('/changePassword', {
        oldPassword,
        newPassword,
        sessionId,
      });
      addSuccess({ message: 'Password change done' });
    } catch (e) {
      addError({ message: 'old Password incorrect' });
    }
  }
}

export async function register(username: string, email: string, password: string): void {
  await axios.post('/register', {
    username,
    email,
    password,
  });
  addSuccess({ title: 'Successfully registered', message: 'You will have to wait to be activated before you can login.' });
}

export async function getUsers(): Array<ClientUser> {
  return await axios.get('/getUsers');
}

export async function getRoles(): Array<RoleType> {
  return await axios.get('/role/getAll');
}

export async function saveRole(user: ClientUser, role: RoleType) {
  await axios.post('/saveRole', {
    user,
    role,
  });
}

export async function saveActive(user: ClientUser, active: bool) {
  await axios.post('/saveActive', {
    user,
    active,
  });
}
