declare type Line = {
  text: string,
  timeout: ?Date,
  color: string,
  user?: ClientUser,
  userId: number,
  hash: string,
}
