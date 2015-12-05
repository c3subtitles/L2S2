import { List, Map } from 'immutable';

const shortcuts = Map({
  '1': localStorage.sc1 || '',
  '2': localStorage.sc2 || '',
  '3': localStorage.sc3 || '',
  '4': localStorage.sc4 || '',
  '5': localStorage.sc5 || '',
  '6': localStorage.sc6 || '',
  '7': localStorage.sc7 || '',
  '8': localStorage.sc8 || '',
  '9': localStorage.sc9 || '',
  '0': localStorage.sc0 || '',
});

const initialState: State = {
  currentRoom: null,
  readLines: List(),
  roles: List(),
  rooms: Map(),
  sessionId: localStorage.sessionId || null,
  shortcuts,
  user: null,
  userInRoom: Map(),
  users: Map(),
};

export default initialState;
