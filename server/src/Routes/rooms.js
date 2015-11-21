

import { getUserForSessionId } from '../Services/users';
import { Room } from '../models';

global.router.get('/api/rooms/all', async function(ctx) {
  const user = await getUserForSessionId(ctx.request.headers.sessionid);
  if (user) {
    ctx.body = await Room.find();
    ctx.status = 200;
  }
});
