// @flow
import EventEmitter from 'eventemitter';

export const globalEventEmitter = new (class GlobalEventEmitter extends EventEmitter {})();
