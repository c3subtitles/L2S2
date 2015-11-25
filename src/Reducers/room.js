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
    usersInRoom: action.payload.usersInRoom,
  }),
};
