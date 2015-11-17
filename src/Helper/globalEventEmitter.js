import EventEmitter from 'eventemitter';

export default new (class GlobalEventEmitter extends EventEmitter {})();
