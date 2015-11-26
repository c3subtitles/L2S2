import 'imports?this=>window&define=>false!../../primusClient';
import { lineUpdate, newLine, userJoined, userLeft } from '../Actions/rooms';

const config = require(CONFIGPATH);

const primus = global.Primus.connect(config.primusLocation);

primus.on('open', () => {
  updateSessionId();
});

primus.on('lineStart', (roomId, userId, text) => {
  lineUpdate(roomId, userId, text);
});

primus.on('line', (roomId, userId, text) => {
  newLine(roomId, userId, text);
});

primus.on('join', (roomId, user) => {
  userJoined(roomId, user);
});

primus.on('leave', (roomId, user) => {
  userLeft(roomId, user);
});

export function updateSessionId() {
  primus.emit('sessionId', localStorage.sessionId);
}

export function lineStart(roomId: number, text: string) {
  primus.emit('lineStart', roomId, text);
}

export function line(roomId: number, text: string) {
  primus.emit('line', roomId, text);
}

export function joinRoom(roomId) {
  primus.emit('join', roomId);
}

export function leaveRoom(roomId) {
  primus.emit('leave', roomId);
}
