export type ClientRoom = {
  room: {
    id: number,
    locked: bool,
    name: string,
    speechLocked: bool,
  },
  lines: string[],
  userInRoom: User[],
}
