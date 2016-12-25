// @flow
import EventEmitter from 'eventemitter3';

export const globalEventEmitter = new (class GlobalEventEmitter extends EventEmitter {})();
