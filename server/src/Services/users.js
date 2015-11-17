/* @flow */

import { User, Role } from '../models';
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
  const user = await User.findOne({ id }).populate('role');
  console.log(user);
  return user;
}

export async function register(username: string, password: string, email: string) {
  let user = await User.findOne({ username });
  if (user) {
    throw { title: 'Duplicate User', message: 'Username already in use' };
  }
  const userRole = await Role.findOne({ name: 'User' });
  user = await User.create({
    username,
    password,
    email,
    role: userRole ? userRole.id : undefined,
  });
}

export async function login(username: string, password: string) {
  const user = await User.findOne({ username })
  .populate('role');
  if (!user || !await checkPassword(password, user)) {
    throw { title: 'Wrong Credentials', message: 'Username or password wrong' };
  }
  if (!user.active) {
    throw { title: 'Inactive', message: `${user.username} is not active yet. Wait until you are activated.` };
  }
  const sessionId = Session.newSession(user);
  return { user, sessionId };
}

export function logout(sessionId: string) {
  Session.removeSession(sessionId);
}
