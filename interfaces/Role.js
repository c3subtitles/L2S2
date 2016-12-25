export type Role = {
  canActivateUser: bool,
  canChangeUserRole: bool,
  canCreateRoom: bool,
  canCreateUser: bool,
  canDeleteRoom: bool,
  canDeleteUser: bool,
  canJoinLocked: bool,
  canLock: bool,
  canSpeechLock: bool,
  id: number,
  name: string,
}
