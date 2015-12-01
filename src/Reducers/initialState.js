import { List, Map } from 'immutable';

export default {
  readLines: List(),
  roles: List(),
  rooms: Map(),
  sessionId: localStorage.sessionId || null,
  user: null,
  userInRoom: Map(),
  users: Map(),
};
