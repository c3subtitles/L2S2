import { getUserForSessionId } from '../Services/users';
import { Role } from '../models';

global.router.get('/api/role/getAll', async function(ctx) {
  const user = await getUserForSessionId(ctx.request.headers.sessionid);
  if (user) {
    const roles = await Role.find();
    ctx.body = roles.map(r => ({
      id: r.id,
      name: r.name,
    }));
  }
});
