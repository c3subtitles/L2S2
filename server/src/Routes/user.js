/* @flow */
import { login, getClientUserRepresentation, logout, checkPassword, register, getUsers, getCurrentUserFromSession, resetPassword } from '../Services/users';
import { User, Onetimetoken } from '../models';
import { createSession, deleteSessionForUser } from '../Services/redis';


global.router.post('/api/login', async function(ctx) {
  const { username, password } = ctx.request.body;
  const { user, sessionId } = await login(username, password);
  ctx.body = {
    sessionId,
    user: getClientUserRepresentation(user),
  };
});

global.router.post('/api/userForSessionId', async function(ctx) {
  const user = await getCurrentUserFromSession(ctx);
  ctx.body = getClientUserRepresentation(user);
});

global.router.post('/api/userForToken', async ctx => {
  const token = await Onetimetoken.findOne({
    token: ctx.request.body.token,
  }).populate('user');
  if (token) {
    const user = token.user;
    const sessionId = await createSession(user.id);
    ctx.body = {
      user,
      sessionId,
    };
    ctx.status = 200;
    await token.destroy();
  } else {
    throw { message: 'Invalid Token, please request anotehr token.' };
  }
});

global.router.post('/api/logout', (ctx) => {
  if (ctx.request.headers.sessionid) {
    logout(ctx.request.headers.sessionid);
  }
  ctx.status = 200;
});

global.router.post('/api/changePassword', async function(ctx) {
  const { oldPassword, newPassword } = ctx.request.body;
  const user = await getCurrentUserFromSession(ctx);
  const correctOld = await checkPassword(oldPassword, user);
  if (!correctOld) {
    throw { message: 'Old Password is incorrect' };
  }
  const cryptedPw = await global.encrypt(newPassword);
  await User.update({ id: user.id }, { password: cryptedPw });
  ctx.status = 200;
});

global.router.post('/api/register', async function(ctx) {
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    throw { message: 'Please fill out all fields.' };
  }
  await register(username, password, email);
  ctx.status = 200;
});

global.router.get('/api/users', async function(ctx) {
  await getCurrentUserFromSession(ctx);
  ctx.body = await getUsers();
});


global.router.put('/api/users/:id', async function(ctx) {
  const ownUser = await getCurrentUserFromSession(ctx);
  const user = ctx.request.body;
  if (user.hasOwnProperty('active') && !ownUser.role.canActivateUser) {
    throw { message: 'insufficent permissions' };
  }
  if (user.hasOwnProperty('role') && !ownUser.role.canChangeUserRole) {
    throw { message: 'insufficent permissions' };
  }
  await User.update({ id: ctx.params.id }, user);
  if (!user.active) {
    deleteSessionForUser(user);
  }
  ctx.body = await User.findOne({ id: ctx.params.id }).populate('role');
  ctx.status = 200;
});

global.router.delete('/api/users/:id', async function(ctx) {
  const ownUser = await getCurrentUserFromSession(ctx);
  if (!ownUser.role.canDeleteUser) {
    throw { message: 'insufficent permissions' };
  }
  const userToDelete = await User.findOne({ id: ctx.params.id });
  await userToDelete.destroy();
  ctx.status = 200;
});

global.router.post('/api/users/resetPassword', async function(ctx) {
  const user = await User.findOne({
    email: ctx.request.body.email,
  });
  ctx.status = 200;
  if (!user) {
    return;
  }
  resetPassword(user);
});


global.router.get('/api/stats', async function(ctx) {
  const ownUser = await getCurrentUserFromSession(ctx);
  if (ownUser.role.id !== 1) {
    throw { message: 'insufficent permissions' };
  }
  ctx.body = `${Object.keys(global.primus.connections).length} Clients`;
  ctx.status = 200;
});
