import { List } from 'immutable';

declare class State extends Object {
  currentRoom: ?RoomType,
  readLines: List<string>,
  roles: List<RoleType>,
  rooms: Map<number, RoomType>,
  sessionId: ?string,
  shortcuts: Map<string, string>,
  user: ?ClientUser,
  userInRoom: Map<number, ClientUser>,
  users: Map<number, ClientUser>,
}
