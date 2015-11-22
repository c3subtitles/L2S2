import { handleActions } from 'redux-actions';
import _ from 'lodash';

function updateUsers(state, user) {
  const newState: { users: Array<ClientUser> } = {
    users: _.sortBy(state.users.filter(u => u.id !== user.id), 'username'),
  };
  newState.users.push(user);
  if (state.user.id === user.id) {
    newState.user = user;
  }
  return newState;
}

export default handleActions({
  FETCH_USER: (state, action) => ({
    ...action.payload,
    initialized: true,
  }),
  FETCH_USERS: (state, action) => ({
    users: _.sortBy(action.payload, 'username'),
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
}, {
  user: null,
  users: [],
  roles: [],
});
