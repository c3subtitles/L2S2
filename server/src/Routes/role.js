import { getUserForSessionId } from '../Services/users';
import { Role } from '../models';

global.router.get('/api/roles', async function(ctx) {
  await getUserForSessionId(ctx.request.headers.sessionid);
  const roles = await Role.find();
  ctx.body = roles.map(r => ({
    id: r.id,
    name: r.name,
  }));
});
