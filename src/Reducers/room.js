export default {
  FETCH_ROOMS: (state, action) => ({
    rooms: action.payload,
  }),
  CREATE_ROOM: (state, action) => {
    state.rooms.push(action.payload);
    return {
      rooms: state.rooms,
    };
  },
  DELETE_ROOM: (state, action) => ({
    rooms: state.rooms.filter(r => r.id !== action.payload),
  }),
};
