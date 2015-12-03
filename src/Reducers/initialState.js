import { List, Map } from 'immutable';

const initialState: State = {
  currentRoom: null,
  readLines: List(),
  roles: List(),
  rooms: Map(),
  sessionId: localStorage.sessionId || null,
  user: null,
  userInRoom: Map(),
  users: Map(),
};

export default initialState;
