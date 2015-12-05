/* @flow */

import 'imports?this=>window&define=>false!../../primusClient';
import { lineUpdate, newLine, userJoined, userLeft, updateRoom } from '../Actions/rooms';


const config = require(CONFIGPATH);

const primus = global.Primus.connect(config.primusLocation);

primus.on('open', () => {
  updateSessionId();
});

primus.on('lineStart', (roomId, userId, text) => {
  lineUpdate(roomId, userId, text);
});

primus.on('line', (roomId, userId, text) => {
  if (text && text.trim().length > 0) {
    newLine(roomId, userId, text);
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
  primus.emit('sessionId', localStorage['sessionId']);
}

export function lineStart(roomId: number, text: string) {
  primus.emit('lineStart', roomId, text);
}

export function line(roomId: number, text: string, color: string) {
  primus.emit('line', roomId, text, color);
}

export function joinRoom(roomId: number) {
  primus.emit('join', roomId);
}

export function leaveRoom(roomId: number) {
  primus.emit('leave', roomId);
}
