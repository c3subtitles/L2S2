// @flow
import Primus from 'primusClient';


const primus = Primus.connect('/api/primus');

primus.on('open', () => {
  updateSessionId();
});

primus.on('reconnected', () => {
  updateSessionId();
  // reconnected();
});

export function updateSessionId() {
  primus.emit('sessionId', localStorage.getItem('sessionId'));
}

export function lineStart(roomId: number, text: string, userId: number) {
  primus.emit('lineStart', roomId, text);
  // lineUpdate(roomId, userId, text);
}

export function line(roomId: number, text: string, user: User) {
  primus.emit('line', roomId, text, user.color);
  // newLine(roomId, user.id, text, user.color);
}

export function joinRoom(roomId: number) {
  primus.emit('join', roomId);
}

export function leaveRoom(roomId: number) {
  primus.emit('leave', roomId);
}
