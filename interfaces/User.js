export type User = {
  active: bool,
  canBan: bool,
  email: string,
  id: number,
  role: Role,
  username: string,
}

export type ClientUser = User & {
  current: string,
}
