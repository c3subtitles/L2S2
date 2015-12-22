declare class RoleType extends Object {
  canActivateUser: bool;
  canChangeUserRole: bool;
  canCreateRoom: bool;
  canDeleteRoom: bool;
  canDeleteUser: bool;
  canJoinLocked: bool;
  canLock: bool;
  canSpeechLock: bool;
  id: number;
  name: string;
}

declare class ClientUser extends Object {
  active: bool;
  canBan: bool;
  color?: string;
  currentLine: ?string;
  id: number;
  role: RoleType;
  username: string;
}

declare class RoomType extends Object {
  id: number;
  locked: bool;
  name: string;
  speechLocked: bool;
}
