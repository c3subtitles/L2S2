import { handleActions } from 'redux-actions';
import user from './user';
import initialState from './initialState';



export default handleActions({
  ...user,
}, initialState);
