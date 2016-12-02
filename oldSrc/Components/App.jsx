/* @flow */
import _ from 'lodash';
import { createStore, bindActionCreators, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Radium from 'radium';
import React from 'react';
import reduxPromise from 'redux-promise';

const reduxActions = require('redux-actions');
reduxActions.handleActions = (function(old) {
  return function(reducerMap: Object, ...rest) {
    _.each(reducerMap, (r, index) => {
      reducerMap[index] = function(state, action) {
        const newState = r(state, action);
        return {
          ...state,
          ...newState,
        };
      };
    });
    return old.call(this, reducerMap, ...rest);
  };
}(reduxActions.handleActions));
const reducer = require('../Reducers').default;

const store = compose(
  applyMiddleware(reduxPromise),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)(createStore)(reducer);

global.store = store;

reduxActions.createAction = (function(old) {
  return function(...args) {
    const action = old.call(this, (args: any));
    return bindActionCreators(action, store.dispatch);
  };
}(reduxActions.createAction));

const L2S2 = require('./L2S2').default;

@Radium
export default class App extends React.Component {
  static childContextTypes = {
    store: React.PropTypes.any,
  };
  getChildContext(): any {
    return {
      store,
    };
  }
  static propTypes = {
    children: React.PropTypes.any,
  };
  render() {
    const { children } = this.props;
    const fullFlex = {
      display: 'flex',
      WebkitFlex: '1 1 0',
      flex: '1 1 0',
      WebkitFlexDirection: 'column',
      flexDirection: 'column',
    };
    return (
      <div style={fullFlex}>
        <Provider store={store}>
          <L2S2>
            {children}
          </L2S2>
        </Provider>
      </div>
    );
  }
}
