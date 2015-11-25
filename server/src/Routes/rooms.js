import { getUserForSessionId } from '../Services/users';
import { getUsersInRoom, joinRoom } from '../Services/rooms';
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

global.router.post('/api/rooms/save', async function(ctx) {
  const user = await getUser(ctx);
  if (user && user.role.canCreateRoom) {
    const { room } = ctx.request.body;
    let dbRoom;
    if (room.id) {
      dbRoom = await Room.findOne({ id: room.id });
      if (!dbRoom) {
        ctx.status = 400;
        return;
      }
      dbRoom.name = room.name;
      await dbRoom.save();
    } else {
      dbRoom = await Room.create({ name: room.name });
    }
    ctx.body = dbRoom;
    ctx.status = 200;
  } else {
    ctx.status = 400;
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

global.router.post('/api/rooms/join', async function(ctx) {
  const user = await getUser(ctx);
  if (user) {
    const { roomId } = ctx.request.body;
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      ctx.status = 400;
      return;
    }
    joinRoom(room, user);
    ctx.body = {
      room,
      usersInRoom: await getUsersInRoom(room),
    };
    ctx.status = 200;
  } else {
    ctx.status = 400;
  }
});
