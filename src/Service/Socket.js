// @flow
import Primus from 'primusClient';
import RoomService from 'Service/Room';


const primus = Primus.connect('/api/primus');

primus.on('open', () => {
  updateSessionId();
});

primus.on('reconnected', () => {
  updateSessionId();
  // reconnected();
});

primus.on('lineStart', (roomId: number, userId: number, text: string) => {
  RoomService.lineUpdate(roomId, userId, text);
});

export function updateSessionId() {
  primus.emit('sessionId', localStorage.getItem('sessionId'));
}

export function lineStart(roomId: number, text: string, userId: number) {
  primus.emit('lineStart', roomId, text);
  RoomService.lineUpdate(roomId, userId, text);
}

export function line(roomId: number, text: string, user: User) {
  primus.emit('line', roomId, text, user.color);
  RoomService.lineUpdate(roomId, user.id, '');
  RoomService.line(roomId, text, user.color);
}

export function joinRoom(roomId: number) {
  primus.emit('join', roomId);
}

export function leaveRoom(roomId: number) {
  primus.emit('leave', roomId);
}
