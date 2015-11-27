import { login, getClientUserRepresentation, logout, checkPassword, register, getUsers, getCurrentUserFromSession } from '../Services/users';
import { User } from '../models';


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
