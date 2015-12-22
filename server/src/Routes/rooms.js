/* @flow */
import _ from 'lodash';
import { getCurrentUserFromSession } from '../Services/users';
import { getUsersInRoom, joinRoom, getLinesForRoom } from '../Services/rooms';
import { Room } from '../models';

global.router.get('/api/rooms', async function(ctx) {
  ctx.body = await Room.find();
  ctx.status = 200;
});

global.router.put('/api/rooms/:id', async function(ctx) {
  const user = await getCurrentUserFromSession(ctx);
  const dbRoom: RoomType = await Room.findOne({ id: ctx.params.id });
  if (!dbRoom) {
    throw { message: 'Invalid Room' };
  }
  const room = ctx.request.body;
  if (
    (dbRoom.name !== room.name && !user.role.canCreateRoom) ||
    (dbRoom.locked !== room.locked && !user.role.canLock) ||
    (dbRoom.speechLocked !== room.speechLocked && !user.role.canSpeechLock)
  ) {
    throw { message: 'insufficent Permission' };
  }
  Object.assign(dbRoom, ctx.request.body);
  await dbRoom.save();
  _.each(global.primus.connections, s => {
    s.emit('roomUpdate', dbRoom);
  });
  ctx.body = dbRoom;
  ctx.status = 200;
});

global.router.post('/api/rooms', async function(ctx) {
  const user = await getCurrentUserFromSession(ctx);
  if (!user.role.canCreateRoom) {
    throw { message: 'insufficent Permission' };
  }
  const { room } = ctx.request.body;
  const dbRoom = await Room.create({ name: room.name });
  ctx.body = dbRoom;
  ctx.status = 200;
});

global.router.delete('/api/rooms/:id', async function(ctx) {
  const user = await getCurrentUserFromSession(ctx);
  if (!user.role.canDeleteRoom) {
    throw { message: 'insufficent Permission' };
  }
  const room = await Room.findOne({ id: ctx.params.id });
  if (!room) {
    throw { message: 'invalid Room id' };
  }
  await room.destroy();
  ctx.status = 200;
});

global.router.get('/api/rooms/:id/join', async function(ctx) {
  const user: ClientUser = await getCurrentUserFromSession(ctx);
  const room: RoomType = await Room.findOne({ id: ctx.params.id });
  if (!room) {
    throw { message: 'invalid Room' };
  }
  if (room.locked && !user.role.canJoinLocked) {
    throw { message: 'insufficent Permission' };
  }
  joinRoom(room.id, user.id);
  ctx.body = {
    ...await getUsersInRoom(room.id),
    room,
  };
  ctx.status = 200;
});

global.router.get('/api/rooms/:id/joinRead', async (ctx) => {
  ctx.body = {
    room: await Room.findOne({ id: ctx.params.id }),
    lines: getLinesForRoom(Number.parseInt(ctx.params.id)),
  };
  ctx.status = 200;
});
