

import { login, getClientUserRepresentation, getUserForSessionId, logout, checkPassword, register } from '../Services/users';
import { User, Role } from '../models';

global.router.post('/api/login', async function(ctx) {
  const { username, password } = ctx.request.body;
  const { user, sessionId } = await login(username, password);
  if (user) {
    console.log(user, sessionId);
    ctx.status = 200;
    ctx.body = {
      sessionId,
      user: getClientUserRepresentation(user),
    };
  } else {
    ctx.status = 403;
  }
});

global.router.post('/api/userForSessionId', async function(ctx) {
  const { sessionId } = ctx.request.body;
  const user = await getUserForSessionId(sessionId);
  if (user) {
    ctx.body = getClientUserRepresentation(user);
    ctx.status = 200;
  }
});

global.router.post('/api/logout', (ctx) => {
  const { sessionId } = ctx.request.body;
  logout(sessionId);
  ctx.status = 200;
});

global.router.post('/api/changePassword', async function(ctx) {
  const { sessionId, oldPassword, newPassword } = ctx.request.body;
  const user = await getUserForSessionId(sessionId);
  if (user) {
    const correctOld = await checkPassword(oldPassword, user);
    if (!correctOld) {
      ctx.status = 400;
      return;
    }
    await User.update({ id: user.id }, { password: newPassword });
    ctx.status = 200;
  }
});

global.router.post('/api/register', async function(ctx) {
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    throw { message: 'Please fill out all fields.' };
  }
  await register(username, password, email);
  ctx.status = 200;
});

global.router.post('/api/saveRole', async function(ctx) {
  const ownUser = await getUserForSessionId(ctx.request.headers.sessionid);
  if (ownUser) {
    if (!ownUser.role.canChangeUserRole) {
      throw { message: 'insufficent Permission' };
    }
    const { user, role } = ctx.request.body;
    const userToSave = await User.findOne({ id: user.id });
    const newRole = await Role.findOne({ id: role.id });
    if (userToSave && newRole) {
      userToSave.role = newRole;
      await userToSave.save();
      ctx.status = 200;
    }
  }
});

global.router.post('/api/saveActive', async function(ctx) {
  const ownUser = await getUserForSessionId(ctx.request.headers.sessionid);
  if (ownUser) {
    if (!ownUser.role.canActivateUser) {
      throw { message: 'insufficent Permission' };
    }
    const { user, active } = ctx.request.body;
    const userToSave = await User.findOne({ id: user.id });
    if (userToSave) {
      userToSave.active = active;
      await userToSave.save();
      ctx.status = 200;
    } else {
      ctx.status = 400;
    }
  }
});
