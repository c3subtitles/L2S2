import { Map, List } from 'immutable';
import { User, Line, Room } from '../models';

let rooms = Map();

export async function getUsersInRoom(roomId: number) {
  const { userIds, lines } = rooms.get(roomId);
  if (userIds) {
    const users = await* userIds.map(async u => ({
      ...(await User.findOne({ id: u.id })).client(),
      currentLine: u.currentLine,
    })).toArray();
    return {
      userInRoom: users,
      lines: lines.takeLast(30).toArray(),
    };
  }
  return {
    userInRoom: [],
    lines: [],
  };
}

export function getLinesForRoom(roomId: number) {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      lines: List(),
      userIds: Map(),
    };
    rooms = rooms.set(roomId, room);
  }
  return room.lines.takeLast(5).map(l => l.line).toArray();
}

export function joinRoom(roomId: number, userId: number) {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      lines: List(),
      userIds: Map(),
    };
  }
  if (!room.userIds) {
    room.userIds = Map();
  }
  if (!room.userIds.has(userId)) {
    room.userIds = room.userIds.set(userId, {
      id: userId,
      currentLine: '',
    });
  }
  rooms = rooms.set(roomId, room);
}

export function leaveRoom(roomId: number, userId: number) {
  const room = rooms.get(roomId);
  if (room && room.userIds) {
    room.userIds = room.userIds.delete(userId);
    rooms = rooms.set(roomId, room);
  }
}

export function leaveAllRooms(userId: number, emitFn: ?Function) {
  rooms = rooms.map((room, roomId) => {
    if (room.userIds && room.userIds.has(userId)) {
      if (emitFn) {
        emitFn(roomId);
      }
      room.userIds = room.userIds.delete(userId);
    }
    return room;
  });
}


export function lineStart(text, userId, roomId: number) {
  try {
    const { userIds } = rooms.get(roomId);
    if (userIds) {
      const userInfo = userIds.get(userId);
      if (userInfo) {
        userInfo.currentLine = text;
      }
    }
  } catch (e) {
    /* ignored */
  }
}

async function addLineToDatabase(text, roomId, userId, color) {
  try {
    const room = await Room.findOne({ id: roomId });
    const line = await Line.create({
      text,
      color,
      user: userId,
      room: room.id,
      roomName: room.name,
    });
    console.log(line);
  } catch (e) {
    console.error(`lineAddFailed ${e}`);
    e.stack();
  }
}

export function addLine(text, roomId: number, userId, color: string) {
  const room = rooms.get(roomId);
  if (room) {
    room.lines = room.lines || List();
    room.lines = room.lines.push({
      line: text,
      color,
      userId,
    });
    rooms = rooms.set(roomId, room);
    addLineToDatabase(text, roomId, userId, color);
  }
}
