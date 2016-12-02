/* @flow */
import Primus from '../../primusClient';
import { reconnected, lineUpdate, newLine, userJoined, userLeft, updateRoom } from '../Actions/rooms';

/* $FlowFixMe */
const config = require(CONFIGPATH).default;
const primus = Primus.connect(config.primusLocation);

primus.on('open', () => {
  updateSessionId();
});

primus.on('reconnected', () => {
  updateSessionId();
  reconnected();
});

primus.on('lineStart', (roomId, userId, text) => {
  lineUpdate(roomId, userId, text);
});

primus.on('line', (roomId, text, userId, color, rawTimeout) => {
  if (text && text.trim().length > 0) {
    let timeout;
    if (rawTimeout) {
      timeout = new Date(rawTimeout);
    }
    newLine(roomId, userId, text, color, timeout);
  }
});

primus.on('join', (roomId, user) => {
  userJoined(roomId, user);
});

primus.on('leave', (roomId, user) => {
  userLeft(roomId, user);
});

primus.on('roomUpdate', room => {
  updateRoom(room);
});

export function updateSessionId() {
  primus.emit('sessionId', localStorage.getItem('sessionId'));
}

export function lineStart(roomId: number, text: string, userId: number) {
  primus.emit('lineStart', roomId, text);
  lineUpdate(roomId, userId, text);
}

export function line(roomId: number, text: string, user: ClientUser) {
  primus.emit('line', roomId, text, user.color);
  newLine(roomId, user.id, text, user.color);
}

export function joinRoom(roomId: number) {
  primus.emit('join', roomId);
}

export function leaveRoom(roomId: number) {
  primus.emit('leave', roomId);
}
