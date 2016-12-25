import { List } from 'immutable';

declare class ReduxState {
  currentRoom?: Room,
  lines: List<string>,
  readBackgroundColor: string,
  readColor: string,
  readGradient: bool,
  readLines: List<string>,
  ready: bool,
  roles: List<Role>,
  rooms: Map<number, Room>,
  sessionId: ?string,
  shortcuts: Map<string, string>,
  user?: ClientUser,
  userInRoom: Map<number, ClientUser>,
  users: Map<number, ClientUser>,
}
