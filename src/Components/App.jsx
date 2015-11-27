import _ from 'lodash';
import { createStore, bindActionCreators, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import React from 'react';
import reduxPromise from 'redux-promise';

let store;
let renderDevtools;

const reduxActions = require('redux-actions');
reduxActions.handleActions = function(old) {
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
}(reduxActions.handleActions);
const reducer = require('../Reducers');


if (IS_PRODUCTION) {
  store = compose(
    applyMiddleware(reduxPromise)
  )(createStore)(reducer);
} else {
  const DT = require('redux-devtools');
  const DockMonitor = require('redux-devtools-dock-monitor');
  const LogMonitor = require('redux-devtools-log-monitor');

  const DevTools = DT.createDevTools(
    <DockMonitor toggleVisibilityKey="H" changePositionKey="Q">
      <LogMonitor/>
    </DockMonitor>
  );


  const createDevStore = compose(
    applyMiddleware(reduxPromise),
    DevTools.instrument(),
    DT.persistState(
      window.location.href.match(
        /[?&]debug_session=([^&]+)\b/
      )
    )
  )(createStore);

  store = createDevStore(reducer);

  if (module.hot) {
    module.hot.accept('../Reducers', () => {
      const nextRootReducer = require('../Reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }

  renderDevtools = () => {
    return <DevTools />;
  };
}

global.store = store;

reduxActions.createAction = function(old) {
  return function() {
    const action = old.apply(this, arguments);
    return bindActionCreators(action, store.dispatch);
  };
}(reduxActions.createAction);


const L2S2 = require('./L2S2');

export default class App extends React.Component {
  static childContextTypes = {
    store: React.PropTypes.any,
  };
  getChildContext() {
    return {
      store,
    };
  }
  static propTypes = {
    children: React.PropTypes.any,
  };
  render() {
    const { children } = this.props;
    const monitor = IS_PRODUCTION ? null : renderDevtools();
    const fullFlex = { display: 'flex', flex: '1 1 0', flexDirection: 'column' };
    return (
      <div style={fullFlex}>
        <Provider store={store}>
          <L2S2>
            {children}
          </L2S2>
        </Provider>
        {monitor}
      </div>
    );
  }
}
