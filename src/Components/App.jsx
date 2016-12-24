// @flow
/* eslint prefer-rest-params: 0 */
import _ from 'lodash';
import { createStore, bindActionCreators, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Radium from 'radium';
import React from 'react';
import reduxPromise from 'redux-promise';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter, Match } from 'react-router';

let store;

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


if (IS_PRODUCTION) {
  store = compose(
    applyMiddleware(reduxPromise)
  )(createStore)(reducer);
} else {
  const createDevStore = compose(
    // $FlowFixMe
    applyMiddleware(() => next => action => {
      // $FlowFixMe
      if (action.payload instanceof Promise) {
        action.payload.catch(err => console.error(err.stack));
      }
      next(action);
    }),
    applyMiddleware(reduxPromise),
  )(createStore);

  store = createDevStore(reducer);

  if (module.hot) {
    // $FlowFixMe
    module.hot.accept('../Reducers', () => {
      const nextRootReducer = require('../Reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
}

global.store = store;

reduxActions.createAction = (function(old) {
  return function() {
    const action = old.apply(this, arguments);
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
  render() {
    const fullFlex = {
      display: 'flex',
      flex: '1 1 0',
      flexDirection: 'column',
    };
    return (
      <MuiThemeProvider>
        <div style={fullFlex}>
          <Provider store={store}>
            <BrowserRouter>
              <Match pattern="/" component={L2S2}/>
            </BrowserRouter>
          </Provider>
        </div>
      </MuiThemeProvider>
    );
  }
}
