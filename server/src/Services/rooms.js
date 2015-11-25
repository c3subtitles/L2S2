import { Map, List } from 'immutable';
import { User } from '../models';

let rooms = Map();

export async function getUsersInRoom(room) {
  const userIds = rooms.get(room.id);
  if (userIds) {
    return await User.find({
      id: userIds,
    });
  }
  return [];
}

export function joinRoom(room, user) {
  let userIds = rooms.get(room.id);
  if (!userIds) {
    userIds = List();
  }
  if (!userIds.has(user.id)) {
    userIds = userIds.push(user.id);
  }
  rooms = rooms.set(room.id, userIds);
}
