import initialState from './initialState';

function updateUsers(state, user) {
  const newState = {
    users: state.users.filter(u => u.id !== user.id).sortBy(u => u.username),
  };
  newState.users = newState.users.set(user.id, user);
  if (state.user.id === user.id) {
    newState.user = user;
  }
  return newState;
}

export default {
  FETCH_USER: (state, action) => ({
    ...action.payload,
    initialized: true,
  }),
  FETCH_USERS: (state, action) => ({
    users: action.payload.sortBy(u => u.username),
  }),
  FETCH_ROLES: (state, action) => ({
    roles: action.payload,
  }),
  LOGIN: (state, action) => action.payload,
  SAVE_ROLE: (state, action) => updateUsers(state, action.payload),
  SAVE_ACTIVE: (state, action) => updateUsers(state, action.payload),
  DELETE_USER: (state, action) => ({
    users: state.users.filter(u => u.id !== action.payload),
  }),
  LOGOUT: () => initialState,
};
