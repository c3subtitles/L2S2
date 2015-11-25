import axios from 'axios';
import _ from 'lodash';
import { addSuccess, addError } from './notifications';

export function hasPermission(permission: string|Array<string>): bool {
  const user = store.getState().user;
  if (!user) {
    return false;
  }
  const permissions: Array<string> = _.isArray(permission) ? permission : [permission];
  return permissions.some(p => user && user.role[p]);
}

export async function changePassword(oldPassword: string, newPassword: string) {
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

export async function register(username: string, email: string, password: string) {
  await axios.post('/register', {
    username,
    email,
    password,
  });
  addSuccess({ title: 'Successfully registered', message: 'You will have to wait to be activated before you can login.' });
}
