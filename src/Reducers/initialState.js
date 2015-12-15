import { List, Map } from 'immutable';

const shortcuts = Map({
  '#1': localStorage['sc#1'] || '',
  '#2': localStorage['sc#2'] || '',
  '#3': localStorage['sc#3'] || '',
  '#4': localStorage['sc#4'] || '',
  '#5': localStorage['sc#5'] || '',
  '#6': localStorage['sc#6'] || '',
  '#g': localStorage['sc#g'] || '*gelächter*',
  '#a': localStorage['sc#a'] || '*applaus*',
});

const readGradient = JSON.parse(localStorage['readGradient']);
const initialState: State = {
  currentRoom: null,
  gradientColor: localStorage['gradientColor'] || 'rgba(255,255,255,1), rgba(255,255,255,0.7)',
  readBackgroundColor: localStorage['readbgColor'] || 'white',
  readColor: localStorage['readColor'] || 'black',
  readGradient: readGradient == undefined ? true : readGradient,
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
