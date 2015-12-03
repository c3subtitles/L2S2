declare class State extends Object {
  currentRoom: ?RoomType,
  readLines: List<string>,
  roles: List<RoleType>,
  rooms: Map<number, Room>,
  sessionId: ?string,
  user: ?ClientUser,
  userInRoom: Map<number, ClientUser>,
  users: Map<number, ClientUser>,
}
