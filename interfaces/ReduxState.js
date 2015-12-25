import { List } from 'immutable';

declare class ReduxState {
  currentRoom?: RoomType,
  readBackgroundColor: string,
  readColor: string,
  readGradient: bool,
  readLines: List<string>,
  roles: List<RoleType>,
  rooms: Map<number|?string, RoomType>,
  sessionId: ?string,
  shortcuts: Map<string, string>,
  user?: ClientUser,
  userInRoom: Map<number, ClientUser>,
  users: Map<number, ClientUser>,
}
