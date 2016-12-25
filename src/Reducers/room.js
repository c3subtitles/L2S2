// @flow
/* eslint eqeqeq: 0 */
import { List, Map } from 'immutable';
import _ from 'lodash';

const colors: List<string> = List(['#FFC7C7', '#FFF1C7', '#E3FFC7', '#C7FFD5', '#C7FFFF', '#C7D5FF', '#E3C7FF', '#FFC7F1']);

function setColors(userInRoom: Map<number, ClientUser>, user: ?ClientUser) {
  const usedColors: List<?string> = userInRoom.map(u => u.color).toList();
  let availableColors = colors.filter(c => !usedColors.contains(c));
  return userInRoom.map(u => {
    if (!u.color) {
      if (availableColors.size <= 0) {
        availableColors = colors;
      }
      u.color = availableColors.last();
      availableColors = availableColors.pop();
      if (user && user.id === u.id) {
        user.color = u.color;
      }
    }
    return u;
  });
}

function processLines(lines: List<Line>, userInRoom: Map<number, ClientUser>) {
  return lines.map(l => {
    if (l.user) {
      return l;
    }
    if (l.userId) {
      l.user = userInRoom.get(l.userId);
    }
    l.color = l.color || '#FFC7C7';
    return l;
  });
}

function updateRoom(state: ReduxState, { payload }: any) {
  // $FlowFixMe
  const rooms: Map<number, Room> = state.rooms.set(payload.id, payload);
  return {
    currentRoom: payload,
    rooms: rooms.sortBy(r => r.id),
  };
}

export default {
  CHECK_LINES: (state: ReduxState) => {
    const refDate = new Date();
    const readLines = state.readLines.filter(l => l.timeout > refDate);
    return {
      readLines,
    };
  },
  FETCH_ROOMS: (state: ReduxState, action: any) => ({
    rooms: action.payload.sortBy(r => r.id),
  }),
  CREATE_ROOM: (state: ReduxState, action: any) => ({
    // $FlowFixMe
    rooms: state.rooms.set(action.payload.id, action.payload).sortBy(r => r.id),
  }),
  DELETE_ROOM: (state: ReduxState, action: any) => ({
    // $FlowFixMe
    rooms: state.rooms.filter(r => r.id !== action.payload && r !== action.payload),
  }),
  SAVE_ROOM: (state: ReduxState, action: any) => {
    state.rooms = state.rooms.set(action.payload.id, action.payload);
    // $FlowFixMe
    state.rooms = state.rooms.delete(undefined);
    return {
      // $FlowFixMe
      rooms: state.rooms.sortBy(r => r.id),
    };
  },
  GET_NEXT_TALK: (state: ReduxState, { payload: { nextTalk } }: any) => ({
    nextTalk,
  }),
  JOIN_ROOM: (state: ReduxState, { payload: { room, userInRoom, lines } }: any) => {
    const newUserInRoom = setColors(userInRoom, state.user);
    return {
      currentRoom: room,
      lines: processLines(lines, newUserInRoom),
      user: _.clone(state.user),
      userInRoom: newUserInRoom,
      write: true,
    };
  },
  LEAVE_ROOM: () => ({
    write: false,
    currentRoom: null,
    userInRoom: null,
    lines: null,
  }),
  LINE_UPDATE: (state: ReduxState, { payload: { roomId, userId, text } }: any) => {
    if (state.currentRoom && roomId == state.currentRoom.id) {
      let user = state.userInRoom.get(userId);
      if (user) {
        user = {
          ...user,
          currentLine: text,
        };
        return {
          // $FlowFixMe
          userInRoom: state.userInRoom.set(userId, user),
          // $FlowFixMe
          user: user.id === state.user.id ? user : state.user,
        };
      }
    }
  },
  NEW_LINE: (state: ReduxState, { payload: { roomId, userId, text, color, timeout } }: any) => {
    state.readLines = state.readLines.push({
      text,
      timeout,
    });
    if (state.readLines.size > 30) {
      state.readLines = state.readLines.takeLast(30);
    }
    if (state.write && state.currentRoom && roomId == state.currentRoom.id) {
      let user = state.userInRoom.get(userId);
      if (user) {
        user = {
          ...user,
          currentLine: '',
        };
        // $FlowFixMe
        state.userInRoom = state.userInRoom.set(userId, user);
        state.lines = state.lines.push({
          line: text,
          user,
          color,
        });
      }
      return {
        lines: state.lines,
        readLines: state.readLines,
        userInRoom: state.userInRoom,
        // $FlowFixMe
        user: user.id === state.user.id ? user : state.user,
        nextTalk: null,
      };
    }
    return {
      readLines: state.readLines,
      nextTalk: null,
    };
  },
  USER_JOINED: (state: ReduxState, { payload: { roomId, user } }: any) => {
    if (state.write && state.currentRoom && roomId == state.currentRoom.id) {
      if (!state.userInRoom.has(user.id)) {
        state.userInRoom = state.userInRoom.set(user.id, user);
        return {
          // $FlowFixMe
          userInRoom: setColors(state.userInRoom),
        };
      }
    }
  },
  USER_LEFT: (state: ReduxState, { payload: { roomId, user } }: any) => {
    // $FlowFixMe
    if (state.write && state.currentRoom && roomId == state.currentRoom.id && state.user.id !== user.id) {
      return {
        userInRoom: state.userInRoom.delete(user.id),
      };
    }
  },
  JOIN_READ_ROOM: (state: ReduxState, { payload }: any) => ({
    read: true,
    write: false,
    currentRoom: payload.room,
    readLines: payload.lines,
  }),
  LEAVE_READ_ROOM: () => ({
    read: false,
    currentRoom: null,
    readLines: List(),
  }),
  LOCK_ROOM: updateRoom,
  SPEECH_LOCK_ROOM: updateRoom,
  UPDATE_ROOM: updateRoom,
  SET_SHORTCUT: (state: ReduxState, { payload: { key, shortcut } }: any) => ({
    shortcuts: state.shortcuts.set(key, shortcut),
  }),
  CHANGE_READ_COLOR: (state: ReduxState, { payload }: any) => payload,
};
