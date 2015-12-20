import { getUserForSessionFromRedis, createSession, deleteSession } from './redis';
import { User, Role, Onetimetoken } from '../models';
import bcrypt from 'bcryptjs';
import UUID from 'uuid-js';
import nodemailer from 'nodemailer';
import sparkPostTransport from 'nodemailer-sparkpost-transport';

function createNodemailTransport() {
  /* eslint-disable camelcase */
  return nodemailer.createTransport(sparkPostTransport({
    sparkPostApiKey: process.env.SPARKPOST_API_KEY,
    options: {
      open_tracking: true,
      click_tracking: true,
      transactional: true,
    },
    campaign_id: 'l2s2',
    content: {
      template_id: 'l2s2-password-reset',
    },
  }));
}

export async function resetPassword(user: ClientUser) {
  const token = await Onetimetoken.findOrCreate({
    user: user.id,
  }, {
    user: user.id,
    token: UUID.create(),
  });
  const transport = createNodemailTransport();
  transport.sendMail({
    substitution_data: {
      /* eslint-enable camelcase */
      user: {
        name: user.username,
        passwordResetUrl: `${process.env.BASE_URL}profile?token=${token.token}`,
      },
    },
    recipients: [{
      address: {
        email: user.email,
        name: user.username,
      },
    }],
  }, (err, info) => {
    if (err) {
      console.error(err);
    }
    if (info) {
      console.log(info);
    }
  });
}

export function checkPassword(password: string, user: ClientUser): Promise {
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
export function activateUser(user: Object, u: Object): Promise {
  if (!u.role.canActivateUser) {
    return Promise.reject(new Error('Insufficent Permission'));
  }
  return user.save({
    active: true,
  });
}

export function getClientUserRepresentation(user: Object): ClientUser {
  return new Object({
    active: user.active,
    canBan: user.canBan,
    id: user.id,
    role: user.role,
    username: user.username,
  });
}

export async function getCurrentUserFromSession(ctx): ClientUser {
  const user = await getUserForSessionId(ctx.request.headers.sessionid);
  if (!user) {
    throw { message: 'Expired Session' };
  }
  return user;
}

export async function getUserForSessionId(sessionId: ?string): ?ClientUser {
  if (sessionId) {
    return await getUserForSessionFromRedis(sessionId);
  }
}

export async function register(username: string, password: string, email: string): Object {
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
  return user;
}

export async function login(username: string, password: string): Object {
  const user = await User.findOne({ username })
  .populate('role');
  if (!user || !await checkPassword(password, user)) {
    throw { title: 'Wrong Credentials', message: 'Username or password wrong' };
  }
  if (!user.active) {
    throw { title: 'Inactive', message: `${user.username} is not active yet. Wait until you are activated.` };
  }
  const sessionId = await createSession(user.id);
  return { user, sessionId };
}

export function logout(sessionId: string) {
  deleteSession(sessionId);
}

export async function getUsers(): Array<ClientUser> {
  const users: Array<ClientUser> = await User.find().populate('role');
  return users.map(user => user.client());
}
