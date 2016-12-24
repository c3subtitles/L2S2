// flow-typed signature: b5503045a64a6220895b8b5633fac383
// flow-typed version: 860a18b2b8/redux-actions_v0.9.x/flow_>=v0.23.x

declare module 'redux-actions' {
  declare function createAction(type: string, payloadCreator?: Function, metaCreator?: Function): Function;
  declare function handleAction(type: string, reducer: Object|Function): Function;
  declare function handleActions(reducerMap: Object, defaultState?: Object): Function;
}
