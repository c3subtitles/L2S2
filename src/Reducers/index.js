import { handleActions } from 'redux-actions';
import user from './user';

export default handleActions({
  ...user,
}, {
  roles: [],
  rooms: [],
  sessionId: localStorage.sessionId,
  users: [],
});
