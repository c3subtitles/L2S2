declare class RoleType extends Object {
  name: string,
  canActivateUser: bool,
  canChangeUserRole: bool,
  canCreateRoom: bool,
  canDeleteRoom: bool,
  canDeleteUser: bool,
  canJoinLocked: bool,
  canLock: bool,
  canSpeechLock: bool
}

declare class ClientUser extends Object {
  active: bool,
  currentLine: ?string,
  id: number,
  role: RoleType,
  username: string,
}
