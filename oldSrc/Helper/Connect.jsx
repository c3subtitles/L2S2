/* eslint no-param-reassign: 0 */
import { connect } from 'react-redux';

export function Connect(reducer) {
  reducer = (function(old = () => null) {
    return function(state) {
      return {
        ...old(state),
        loggedIn: Boolean(state.user),
      };
    };
  }(reducer));

  return function(component) {
    return connect(reducer)(component);
  };
}
