import { connect } from 'react-redux';

export default function(reducer) {
  reducer = function(old = () => null) {
    return function(state) {
      return {
        ...old(state),
        loggedIn: Boolean(state.user),
        user: state.user,
      };
    };
  }(reducer);

  return function(component) {
    return connect(reducer)(component);
  };
}
