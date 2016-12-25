// @flow
import { connect } from 'react-redux';

export function Connect(reducer: any) {
  const newReducer = (function(old = () => null) {
    return function(state) {
      return {
        ...old(state),
        loggedIn: Boolean(state.user),
      };
    };
  }(reducer));

  return function(component: any) {
    return connect(newReducer)(component);
  };
}
