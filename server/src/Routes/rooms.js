

import { getUserForSessionId } from '../Services/users';
import { Room } from '../models';

async function getUser(ctx): ?ClientUser {
  return await getUserForSessionId(ctx.request.headers.sessionid);
}

global.router.get('/api/rooms/all', async function(ctx) {
  const user = await getUser(ctx);
  if (user && user.role.canCreateRoom || user.role.canDeleteRoom) {
    ctx.body = await Room.find();
    ctx.status = 200;
  }
});

global.router.post('/api/rooms/create', async function(ctx) {
  const user = await getUser(ctx);
  if (user && user.role.canCreateRoom) {
    const { name } = ctx.request.body;
    ctx.body = await Room.create({
      name,
    });
    ctx.status = 200;
  }
});

global.router.post('/api/rooms/delete', async function(ctx) {
  const user = await getUser(ctx);
  if (user && user.role.canDeleteRoom) {
    const { id } = ctx.request.body;
    const room = await Room.findOne({ id });
    await room.destroy();
    ctx.status = 200;
  }
});
