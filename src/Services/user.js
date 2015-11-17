import { globalEventEmitter } from 'Helper';
import axios from 'axios';
import Notifications from './notifications';

export default exports;

let sessionId = null;
export let user = null;
export async function login(username: string, password: string) {
  const result = await axios.post('/login', {
    username,
    password,
  });
  localStorage.sessionId = sessionId = result.sessionId;
  user = result.user;
  globalEventEmitter.emit('login');
  return sessionId;
}

export function loggedIn() {
  return Boolean(user);
}

export async function logout() {
  if (!user) {
    return;
  }
  delete localStorage.sessionId;
  await axios.post('/logout', {
    sessionId,
  });
  sessionId = null;
  user = null;
  globalEventEmitter.emit('logout');
}

export function hasPermission(permission: string|Array<string>) {
  if (!loggedIn()) {
    return false;
  }
  if (!_.isArray(permission)) {
    permission = [permission];
  }
  return _.some(permission, p => user.role[p]);
}

export async function loadFromLocalstorage() {
  if (localStorage.sessionId) {
    try {
      const userFromServer = await axios.post('/userForSessionId', {
        sessionId: localStorage.sessionId,
      });
      if (userFromServer) {
        user = userFromServer;
        sessionId = localStorage.sessionId;
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

export async function changePassword(oldPassword, newPassword) {
  if (user) {
    try {
      await axios.post('/changePassword', {
        oldPassword,
        newPassword,
        sessionId,
      });
      Notifications.addSuccess({ message: 'Password change done' });
    } catch (e) {
      Notifications.addError({ message: 'old Password incorrect' });
    }
  }
}
