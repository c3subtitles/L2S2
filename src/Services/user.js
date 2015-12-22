/* @flow */
import axios from 'axios';
import { addSuccess, addError } from './notifications';

export function hasPermission(permission: string|Array<string>): bool {
  const user = store.getState().user;
  if (!user) {
    return false;
  }
  if (!permission.length) {
    return true;
  }
  const permissions: Array<string> = Array.isArray(permission) ? permission : [permission];
  return permissions.some(p => user && user.role[p]);
}

export async function changePassword(oldPassword: string, newPassword: string): Promise {
  const { user, sessionId } = store.getState();
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

export async function register(username: string, email: string, password: string): Promise {
  await axios.post('/register', {
    username,
    email,
    password,
  });
  addSuccess({ title: 'Successfully registered', message: 'You will have to wait to be activated before you can login.' });
}
