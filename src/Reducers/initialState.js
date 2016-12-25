// @flow
import { List, Map } from 'immutable';

const shortcuts = Map({
  '#1': localStorage['sc#1'] || '',
  '#2': localStorage['sc#2'] || '',
  '#3': localStorage['sc#3'] || '',
  '#4': localStorage['sc#4'] || '',
  '#5': localStorage['sc#5'] || '',
  '#6': localStorage['sc#6'] || '',
});

const rawReadGradient = localStorage.getItem('readGradient');
const readGradient = rawReadGradient ? JSON.parse(rawReadGradient) : false;
// $FlowFixMe
const initialState: ReduxState = {
  currentRoom: null,
  lines: List(),
  readBackgroundColor: localStorage.getItem('readbgColor') || '#ffffff',
  readColor: localStorage.getItem('readColor') || '#000000',
  readGradient,
  readLines: List(),
  ready: false,
  roles: List(),
  rooms: Map(),
  sessionId: localStorage.getItem('sessionId') || null,
  shortcuts,
  user: null,
  userInRoom: Map(),
  users: Map(),
};

export default initialState;
