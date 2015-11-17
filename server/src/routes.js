import Users from './Services/users';
import { User } from './models';

global.router.post('/api/login', async function(ctx) {
  const { username, password } = ctx.request.body;
  const { user, sessionId } = await Users.login(username, password);
  if (user) {
    ctx.status = 200;
    ctx.body = {
      sessionId,
      user: Users.getClientUserRepresentation(user),
    };
  } else {
    ctx.status = 403;
  }
});

global.router.post('/api/userForSessionId', async function(ctx) {
  const { sessionId } = ctx.request.body;
  const user = await Users.getUserForSessionId(sessionId);
  if (user) {
    ctx.body = Users.getClientUserRepresentation(user);
    ctx.status = 200;
  } else {
    ctx.status = 400;
  }
});

global.router.post('/api/logout', (ctx) => {
  const { sessionId } = ctx.request.body;
  Users.logout(sessionId);
  ctx.status = 200;
});

global.router.post('/api/changePassword', async function(ctx) {
  const { sessionId, oldPassword, newPassword } = ctx.request.body;
  const user = await Users.getUserForSessionId(sessionId);
  if (user) {
    const correctOld = await Users.checkPassword(oldPassword, user);
    if (!correctOld) {
      ctx.status = 400;
      return;
    }
    await User.update({ id: user.id }, { password: newPassword });
    ctx.status = 200;
  } else {
    ctx.status = 400;
  }
});

global.router.post('/api/register', async function(ctx) {
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    throw { message: 'Please fill out all fields.' };
  }
  await Users.register(username, password, email);
  ctx.status = 200;
});
