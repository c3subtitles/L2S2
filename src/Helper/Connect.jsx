// @flow
import { connect } from 'react-redux';

export function Connect(reducer) {
  const newReducer = (function(old = () => null) {
    return function(state) {
      return {
        ...old(state),
        loggedIn: Boolean(state.user),
      };
    };
  }(reducer));

  return function(component) {
    return connect(newReducer)(component);
  };
}
