import { List, Map } from 'immutable';

const shortcuts = Map({
  '#1': localStorage['sc#1'] || '',
  '#2': localStorage['sc#2'] || '',
  '#3': localStorage['sc#3'] || '',
  '#4': localStorage['sc#4'] || '',
  '#5': localStorage['sc#5'] || '',
  '#6': localStorage['sc#6'] || '',
  '#7': localStorage['sc#7'] || '',
  '#8': localStorage['sc#8'] || '',
  '#9': localStorage['sc#9'] || '',
  '#0': localStorage['sc#0'] || '',
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
