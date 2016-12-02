import { handleActions } from 'redux-actions';
import user from './user';
import initialState from './initialState';
import room from './room';



export default handleActions({
  ...user,
  ...room,
}, initialState);
