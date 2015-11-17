/* @flow */

import { User } from '../models';
import bcrypt from 'bcryptjs';
import Session from './session';
export default exports;


export function checkPassword(password: string, user): Promise {
  return new Promise((resolve) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
export function getInactive(): Promise {
  return User.findAll({
    where: {
      active: false,
    },
  });
}
export function activateUser(user, u) {
  if (!u.role.canActivateUser) {
    return Promise.reject(new Error('Insufficent Permission'));
  }
  return user.save({
    active: true,
  });
}

export function getClientUserRepresentation(user) {
  return {
    username: user.username,
    role: user.role,
  };
}

export async function getUserForSessionId(sessionId: string) {
  const id = Session.getUserIdForSessionId(sessionId);
  return await User.findOne({ id }).populate('role');
}

export async function login(username: string, password: string) {
  const user = await User.findOne({ username })
  .populate('role');
  if (!user || !await checkPassword(password, user)) {
    throw new Error('wrongCredentials');
  }
  if (!user.active) {
    throw new Error('inactive');
  }
  const sessionId = Session.newSession(user);
  return { user, sessionId };
}

export function logout(sessionId: string) {
  Session.removeSession(sessionId);
}
