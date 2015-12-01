import { List, Map } from 'immutable';

const colors: List = List(['magenta', 'teal', 'orange', 'darkblue', 'darkred', 'black', 'darkgreen']);

function setColors(userInRoom: Map) {
  const usedColors: List = userInRoom.map(u => u.color).toList();
  let availableColors = colors.filter(c => !usedColors.contains(c));
  return userInRoom.map(u => {
    if (!u.color) {
      if (availableColors.size <= 0) {
        availableColors = colors;
      }
      u.color = availableColors.last();
      availableColors = availableColors.pop();
    }
    return u;
  });
}

function processLines(lines: List, userInRoom: Map) {
  return lines.map(l => {
    if (l.user) {
      return l;
    }
    l.user = userInRoom.get(l.userId);
    return l;
  });
}

export default {
  FETCH_ROOMS: (state, action) => ({
    rooms: action.payload,
  }),
  CREATE_ROOM: (state, action) => {
    return {
      rooms: state.rooms.push(action.payload),
    };
  },
  DELETE_ROOM: (state, action) => ({
    rooms: state.rooms.filter(r => r.id !== action.payload && r !== action.payload),
  }),
  SAVE_ROOM: (state, action) => {
    const [roomKey] = state.rooms.findEntry(r => r.id === action.payload.id || (r.isNew && r.name === action.payload.name));
    if (roomKey) {
      state.rooms = state.rooms.set(roomKey, action.payload);
    }
    return {
      rooms: state.rooms,
    };
  },
  JOIN_ROOM: (state, { payload: { room, userInRoom, lines } }) => ({
    write: true,
    currentRoom: room,
    userInRoom: setColors(userInRoom),
    lines: processLines(lines, userInRoom),
  }),
  LEAVE_ROOM: () => ({
    write: false,
    currentRoom: null,
    userInRoom: null,
    lines: null,
  }),
  LINE_UPDATE: (state, { payload: { roomId, userId, text } }) => {
    if (state.currentRoom && roomId == state.currentRoom.id) {
      let user = state.userInRoom.get(userId);
      if (user) {
        user = {
          ...user,
          currentLine: text,
        };
        return {
          userInRoom: state.userInRoom.set(userId, user),
          user: user.id === state.user.id ? user : state.user,
        };
      }
    }
  },
  NEW_LINE: (state, { payload: { roomId, userId, text } }) => {
    state.readLines = state.readLines.push(text);
    if (state.write && state.currentRoom && roomId == state.currentRoom.id) {
      let user = state.userInRoom.get(userId);
      if (user) {
        user = {
          ...user,
          currentLine: '',
        };
        state.userInRoom = state.userInRoom.set(userId, user);
        state.lines = state.lines.push({
          line: text,
          user,
        });
      }
      return {
        lines: state.lines,
        readLines: state.readLines,
        userInRoom: state.userInRoom,
        user: user.id === state.user.id ? user : state.user,
      };
    }
    return {
      readLines: state.readLines,
    };
  },
  USER_JOINED: (state, { payload: { roomId, user } }) => {
    if (state.write && state.currentRoom && roomId == state.currentRoom.id) {
      if (!state.userInRoom.has(user.id)) {
        state.userInRoom = state.userInRoom.set(user.id, user);
        return {
          userInRoom: setColors(state.userInRoom),
        };
      }
    }
  },
  USER_LEFT: (state, { payload: { roomId, user } }) => {
    if (state.write && state.currentRoom && roomId == state.currentRoom.id && state.user.id !== user.id) {
      return {
        userInRoom: state.userInRoom.delete(user.id),
      };
    }
  },
  JOIN_READ_ROOM: (state, { payload }) => ({
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
};
