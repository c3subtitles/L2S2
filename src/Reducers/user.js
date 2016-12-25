// @flow
import initialState from './initialState';

function updateUsers(state: ReduxState, user: ClientUser) {
  const newState = {
    // $FlowFixMe
    users: state.users.filter(u => u.id !== user.id).sortBy(u => u.username),
  };
  newState.users = newState.users.set(user.id, user);
  // $FlowFixMe
  if (state.user.id === user.id) {
    // $FlowFixMe
    newState.user = user;
  }
  return newState;
}

export default {
  FETCH_USER: (state: ReduxState, action: any) => ({
    ...action.payload,
    initialized: true,
  }),
  FETCH_USERS: (state: ReduxState, action: any) => ({
    users: action.payload.sortBy(u => u.username),
  }),
  FETCH_ROLES: (state: ReduxState, action: any) => ({
    roles: action.payload,
  }),
  LOGIN: (state: ReduxState, action: any) => action.payload,
  SAVE_ROLE: (state: ReduxState, action: any) => updateUsers(state, action.payload),
  SAVE_ACTIVE: (state: ReduxState, action: any) => updateUsers(state, action.payload),
  DELETE_USER: (state: ReduxState, action: any) => ({
    // $FlowFixMe
    users: state.users.filter(u => u.id !== action.payload),
  }),
  LOGOUT: () => initialState,
};
