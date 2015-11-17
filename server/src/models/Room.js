import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'room',
  connection: 'default',
  attributes: {
    name: 'string',
    locked: { type: 'boolean', require: true, defaultsTo: false },
    speechLocked: { type: 'boolean', require: true, defaultsTo: false },
  },
});
