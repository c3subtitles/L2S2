import _ from 'lodash';

const colors = ['#b20000', '#ffd580', '#39e6da', '#2d2db3', '#cc9999', '#77b300', '#40a6ff', '#ff40d9', '#33210d', '#336633', '#738299'];

function setColors(userInRoom: Array) {
  const usedColors = _(userInRoom).pluck('color').compact().value();
  let availableColors = _.filter(colors, c => !_.contains(usedColors, c));
  _(userInRoom).filter(u => !u.color).each(u => {
    if (availableColors.length <= 0) {
      availableColors = colors;
    }
    u.color = availableColors.pop();
  }).value();
  return userInRoom;
}

function processLines(lines: Array, userInRoom: Array) {
  _(lines).filter(l => !l.user).each(l => l.user = _.find(userInRoom, { id: l.userId })).value();
  return lines;
}

export default {
  FETCH_ROOMS: (state, action) => ({
    rooms: action.payload,
  }),
  CREATE_ROOM: (state, action) => {
    state.rooms.push(action.payload);
    return {
      rooms: state.rooms.splice(0),
    };
  },
  DELETE_ROOM: (state, action) => ({
    rooms: state.rooms.filter(r => r.id !== action.payload && r !== action.payload),
  }),
  SAVE_ROOM: (state, action) => {
    const roomIndex = state.rooms.findIndex(r => r.id === action.payload.id || (r.isNew && r.name === action.payload.name));
    if (roomIndex !== -1) {
      state.rooms[roomIndex] = action.payload;
    }
    return {
      rooms: state.rooms,
    };
  },
  JOIN_ROOM: (state, action) => ({
    currentRoom: action.payload.room,
    userInRoom: setColors(action.payload.userInRoom),
    lines: processLines(action.payload.lines, action.payload.userInRoom),
  }),
  LEAVE_ROOM: () => ({
    currentRoom: null,
    userInRoom: null,
    lines: null,
  }),
  LINE_UPDATE: (state, { payload: { roomId, userId, text } }) => {
    if (state.currentRoom && roomId == state.currentRoom.id) {
      const user = _.find(state.userInRoom, { id: userId });
      if (user) {
        user.currentLine = text;
        return {
          userInRoom: state.userInRoom.splice(0),
        };
      }
    }
  },
  NEW_LINE: (state, { payload: { roomId, userId, text } }) => {
    if (state.currentRoom && roomId == state.currentRoom.id) {
      const user = _.find(state.userInRoom, { id: userId });
      if (user) {
        user.currentLine = '';
        state.lines.push({
          line: text,
          user,
        });
      }
      return {
        lines: state.lines.splice(0),
        userInRoom: state.userInRoom.splice(0),
      };
    }
  },
  USER_JOINED: (state, { payload: { roomId, user } }) => {
    if (state.currentRoom && roomId == state.currentRoom.id) {
      const existingUser = _.find(state.userInRoom, { id: user.id });
      if (!existingUser) {
        state.userInRoom.push(user);
        return {
          userInRoom: setColors(state.userInRoom).splice(0),
        };
      }
    }
  },
  USER_LEFT: (state, { payload: { roomId, user } }) => {
    if (state.currentRoom && roomId == state.currentRoom.id) {
      return {
        userInRoom: state.userInRoom.filter(u => u.id !== user.id),
      };
    }
  },
};
